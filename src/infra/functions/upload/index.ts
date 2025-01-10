import { UploadFactory } from '@/domain/upload/factories/upload';
import { httpAdapt } from '@/infra/adapters/http';

export const handler = httpAdapt(UploadFactory.create());
