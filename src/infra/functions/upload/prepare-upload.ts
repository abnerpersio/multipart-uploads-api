import { PrepareUploadFactory } from '@/domain/upload/factories/prepare-upload';
import { httpAdapt } from '@/infra/adapters/http';

export const handler = httpAdapt(PrepareUploadFactory.create());
