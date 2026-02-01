class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = process.env.NODE_ENV === "development" ? true : false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
