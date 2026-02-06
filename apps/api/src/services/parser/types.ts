export interface ParsedProduct {
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  description?: string;
  source_url: string;
}

export interface ParserService {
  parse(url: string): Promise<ParsedProduct>;
}
