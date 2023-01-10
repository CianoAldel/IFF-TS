export interface TypedRequestBody<U> extends Express.Request {
  body: U;
}

export interface TypedRequestQuery<Q> extends Express.Request {
  query: Q;
}
