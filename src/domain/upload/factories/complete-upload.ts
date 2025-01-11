import { CompleteUploadUseCase } from '../use-cases/complete-upload';

export class CompleteUploadFactory {
  static create() {
    return new CompleteUploadUseCase();
  }
}
