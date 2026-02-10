import { ParserService } from "./types";
import { rozetkaParser } from "./rozetka";
import { ParserError } from "./errors";

class ParserFactory {
  // Can be extended with more parsers
  private parsers: Record<string, ParserService> = {
    "rozetka.com.ua": rozetkaParser,
  };

  public getParser(url: string): ParserService {
    try {
      const hostname = new URL(url).hostname;
      
      // Match hostname to parser (basic inclusion check)
      const key = Object.keys(this.parsers).find(k => hostname.includes(k));
      
      if (key && this.parsers[key]) {
        return this.parsers[key];
      }
      
      throw ParserError.invalidUrl();
    } catch (e) {
      if (e instanceof ParserError) throw e;
      throw ParserError.invalidUrl();
    }
  }
}

export const parserFactory = new ParserFactory();
