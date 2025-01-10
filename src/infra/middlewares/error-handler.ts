import { HttpError } from '@/infra/errors/http-error';
import { MiddlewareObj } from '@middy/core';

export function errorHandler(): MiddlewareObj {
  return {
    before: () => {
      // TODO: add sentry context
    },
    onError: (request) => {
      const { error } = request;

      const headers = {
        ...request.response?.headers,
        'Content-Type': 'application/json',
      };

      if (error instanceof HttpError) {
        request.response = {
          ...request.response,
          statusCode: error.statusCode ?? 500,
          body: { message: error.message },
          headers,
        };
        return;
      }

      request.response = {
        ...request.response,
        statusCode: 500,
        body: { message: 'Internal server error' },
        headers,
      };
    },
  };
}
