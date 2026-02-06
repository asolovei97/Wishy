import { Request, Response } from "express";
import { parserFactory } from "@api/services/parser/factory";
import { ParserError } from "@api/services/parser/errors";
import { prisma } from "@api/lib";
import { BaseParserHandler } from "./base";

class ParserHandler extends BaseParserHandler {
  public parse = this.catch(async (req: Request, res: Response) => {
    const { url } = req.body; // or req.query if GET? Post is better for long URLs.

    if (!url) {
      throw new ParserError("URL is required", 400);
    }

    const existedProduct = await prisma.parsedItem.findFirst({
      where: {
        source_url: url,
      },
    });

    if (existedProduct) {
      return this.ok(res, {
        status: "success",
        data: this.formatResponseForCLient(existedProduct),
      });
    }

    const parser = parserFactory.getParser(url);
    const data = await parser.parse(url);

    const createdProduct = await prisma.parsedItem.create({
      data
    });

    return this.ok(res, {
      status: "success",
      data: this.formatResponseForCLient(createdProduct),
    });
  });
}

export const parserHandler = new ParserHandler();
