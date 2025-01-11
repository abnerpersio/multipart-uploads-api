import { Env } from '@/config/env';
import { HttpError } from '@/infra/errors/http-error';
import { s3Client } from '@/lib/clients/s3';
import { HttpRequest, HttpResponse, UseCase } from '@/types/http';
import { AbortMultipartUploadCommand } from '@aws-sdk/client-s3';

type Data = {
  uploadId: string;
  fileKey: string;
};

export class AbortMPUUseCase implements UseCase {
  async execute(request: HttpRequest<Data>): Promise<HttpResponse> {
    const { fileKey, uploadId } = request.body;

    if (!uploadId || !fileKey) {
      throw new HttpError(400, 'Invalid payload');
    }

    const abortCommand = new AbortMultipartUploadCommand({
      Bucket: Env.uploadsBucketName,
      Key: fileKey,
      UploadId: uploadId,
    });

    await s3Client.send(abortCommand);

    return { status: 204 };
  }
}
