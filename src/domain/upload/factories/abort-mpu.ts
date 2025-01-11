import { AbortMPUUseCase } from '../use-cases/abort-mpu';

export class AbortMPUFactory {
  static create() {
    return new AbortMPUUseCase();
  }
}
