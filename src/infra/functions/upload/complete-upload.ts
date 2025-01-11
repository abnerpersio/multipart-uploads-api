import { CompleteUploadFactory } from '@/domain/upload/factories/complete-upload';
import { httpAdapt } from '@/infra/adapters/http';

export const handler = httpAdapt(CompleteUploadFactory.create());
