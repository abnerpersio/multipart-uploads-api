import { UploadUseCase } from '../use-cases/upload';

export class UploadFactory {
  static create() {
    return new UploadUseCase();
  }
}
