import { ListUsersUseCase } from '../use-cases/list-users';

export class ListUsersFactory {
  static create() {
    return new ListUsersUseCase();
  }
}
