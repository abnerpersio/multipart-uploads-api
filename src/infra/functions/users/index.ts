import { ListUsersFactory } from '@/domain/users/factories/list-users';
import { httpAdapt } from '@/infra/adapters/http';
import { routesAdapt } from '@/infra/adapters/routes';

export const handler = routesAdapt([
  {
    path: '/users',
    method: 'GET',
    handler: httpAdapt(ListUsersFactory.create()),
  },
]);
