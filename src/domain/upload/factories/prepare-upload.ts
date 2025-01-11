import { PrepareUploadUseCase } from '../use-cases/prepare-upload';

export class PrepareUploadFactory {
  static create() {
    return new PrepareUploadUseCase();
  }
}
