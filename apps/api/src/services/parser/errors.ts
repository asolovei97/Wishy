import { AppError } from "@api/lib/appError";

export class ParserError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
  }

  static invalidUrl() {
    return new ParserError("Invalid URL or unsupported domain", 400);
  }

  static fetchFailed(status: number) {
    return new ParserError(`Failed to fetch page: ${status}`, status === 404 ? 404 : 502);
  }

  static forbidden() {
    return new ParserError("Access forbidden (Bot protection)", 403);
  }

  static parsingFailed(details?: string) {
    return new ParserError(`Parsing failed: ${details || 'Unknown error'}`, 422);
  }
}
