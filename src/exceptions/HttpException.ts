
export class HttpException extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: number,
        public readonly details?: any
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Fix instanceof
    }
  }
  