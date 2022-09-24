import { Response } from 'node-fetch';

import { Exception } from 'types/error';
import { HttpStatusCode } from './statusCodes';
import { ResponseBody } from './types';

export class MissingTokenError extends Exception {
  name = MissingTokenError.name;
}

export class UnauthorizedError extends Exception {
  name = UnauthorizedError.name;
}

export class MaxRetriesExceededError extends Exception {
  name = UnauthorizedError.name;
}

export class ResponseError extends Exception {
  name = ResponseError.name;
  status: HttpStatusCode;

  constructor(public body: ResponseBody, public response: Response) {
    super(response.statusText);
    this.status = response.status as HttpStatusCode;
  }
}
