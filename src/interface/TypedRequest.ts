export interface TypedRequest<U> extends Express.Request {
  body: U;
}
