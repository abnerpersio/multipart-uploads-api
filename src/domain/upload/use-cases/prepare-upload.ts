import { Env } from '@/config/env';
import { HttpError } from '@/infra/errors/http-error';
import { s3Client } from '@/lib/clients/s3';
import { HttpRequest, HttpResponse, UseCase } from '@/types/http';
import {
  CreateMultipartUploadCommand,
  PutObjectCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';

type Data = {
  fileName: string;
  totalChunks?: number;
};

export class PrepareUploadUseCase implements UseCase {
  async execute(request: HttpRequest<Data>): Promise<HttpResponse> {
    const { fileName, totalChunks } = request.body;

    if (!fileName) {
      throw new HttpError(400, 'Invalid payload');
    }

    const bucket = Env.uploadsBucketName;
    const key = `uploads/${randomUUID()}-${fileName}`;

    const data = totalChunks
      ? await this.prepareMpuUpload({ bucket, key, totalChunks })
      : await this.prepareSingleUpload({ bucket, key });

    return { status: 201, data };
  }

  private async prepareMpuUpload({
    bucket,
    key,
    totalChunks,
  }: {
    bucket: string;
    key: string;
    totalChunks: number;
  }) {
    const createMpuCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
    });

    const { UploadId: uploadId } = await s3Client.send(createMpuCommand);

    if (!uploadId) {
      throw new HttpError(500, 'Failed creating upload');
    }

    const parts = await Promise.all(
      Array.from({ length: totalChunks }, async (_, index) => {
        const partNumber = index + 1;

        const uploadCommand = new UploadPartCommand({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });

        const url = await getSignedUrl(s3Client, uploadCommand, {
          expiresIn: Env.presignedUploadExpiration,
        });

        return { url, partNumber };
      }),
    );

    return {
      isMultipart: true,
      key,
      uploadId,
      parts,
    };
  }

  private async prepareSingleUpload({ bucket, key }: { bucket: string; key: string }) {
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, putCommand, {
      expiresIn: Env.presignedUploadExpiration,
    });

    return {
      isMultipart: false,
      key,
      url,
    };
  }
}
