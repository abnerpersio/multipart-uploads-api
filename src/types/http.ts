export type DefaultData = Record<string, unknown> | undefined;

export type HttpRequest<TData extends DefaultData = undefined, TParams = Record<string, string>> = {
  body: TData;
  params: TParams;
  query: Record<string, string>;
  userId: string | null;
};

export type HttpResponse =
  | {
      status: number;
      data?: any;
      message?: never;
    }
  | {
      status: number;
      message?: string;
      data: never;
    };

export interface UseCase {
  execute(input: HttpRequest<DefaultData>): Promise<HttpResponse>;
}
