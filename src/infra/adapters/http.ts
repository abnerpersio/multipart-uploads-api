import { errorHandler } from '@/infra/middlewares/error-handler';
import { HttpResponse, UseCase } from '@/types/http';
import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

type MiddyEvent = Omit<APIGatewayProxyEventV2, 'body'> & {
  body?: Record<string, unknown>;
};

function prepareResponseBody(result: HttpResponse) {
  if (!result.data && !result.message) return undefined;

  if (result.message) {
    return { message: result.message };
  }

  return { data: result.data };
}

export function httpAdapt(useCase: UseCase) {
  return middy()
    .use(errorHandler())
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(
      httpResponseSerializer({
        defaultContentType: 'application/json',
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
        ],
      }),
    )
    .use(httpCors())
    .handler(async (event: APIGatewayProxyEventV2) => {
      const { body, queryStringParameters, pathParameters } = event as MiddyEvent;

      const result = await useCase.execute({
        query: queryStringParameters,
        params: pathParameters,
        body: body ?? {},
      } as any);

      return {
        statusCode: result.status,
        body: prepareResponseBody(result),
      };
    });
}
