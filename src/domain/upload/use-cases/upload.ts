import { RequestFile } from '@/types/file';
import { HttpRequest, UseCase } from '@/types/http';

type Data = {
  file: RequestFile;
};

export class UploadUseCase implements UseCase {
  async execute(request: HttpRequest<Data>) {
    return {
      status: 200,
      data: {
        name: request.body.file?.filename,
      },
    };
  }
}
