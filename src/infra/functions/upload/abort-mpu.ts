import { AbortMPUFactory } from '@/domain/upload/factories/abort-mpu';
import { httpAdapt } from '@/infra/adapters/http';

export const handler = httpAdapt(AbortMPUFactory.create());
