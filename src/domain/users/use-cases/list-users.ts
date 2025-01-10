import { HttpResponse, UseCase } from '@/types/http';
import { randomUUID } from 'node:crypto';

export class ListUsersUseCase implements UseCase {
  async execute(): Promise<HttpResponse> {
    return {
      status: 200,
      data: [
        {
          id: randomUUID(),
          name: 'Zezinho',
        },
      ],
    };
  }
}
