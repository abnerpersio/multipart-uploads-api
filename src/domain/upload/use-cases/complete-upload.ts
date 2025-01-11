import { Env } from '@/config/env';
import { HttpError } from '@/infra/errors/http-error';
import { s3Client } from '@/lib/clients/s3';
import { HttpRequest, HttpResponse, UseCase } from '@/types/http';
import { CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';

type Data = {
  uploadId: string;
  fileKey: string;
  parts: {
    partNumber: number;
    entityTag: string;
  }[];
};

export class CompleteUploadUseCase implements UseCase {
  async execute(request: HttpRequest<Data>): Promise<HttpResponse> {
    const { fileKey, uploadId, parts } = request.body;

    if (!uploadId || !fileKey || !parts) {
      throw new HttpError(400, 'Invalid payload');
    }

    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: Env.uploadsBucketName,
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          PartNumber: part.partNumber,
          ETag: part.entityTag,
        })),
      },
    });

    await s3Client.send(completeCommand);

    return { status: 200 };
  }
}
