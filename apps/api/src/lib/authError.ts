import { AppError } from "./appError";

class AuthError extends AppError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode);
    this.name = "AuthError";
  }
}

export { AuthError };
