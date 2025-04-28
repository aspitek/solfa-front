import { HttpException } from "./HttpException";

export class UnauthorizedException extends HttpException {  
  constructor(details: string) {
    super('Unauthorized', 401, details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
