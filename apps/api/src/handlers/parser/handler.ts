import { Request, Response } from "express";
import { ParserError } from "@api/services/parser/errors";
import { prisma } from "@api/lib";
import { BaseParserHandler } from "./base";

class ParserHandler extends BaseParserHandler {
  public parse = this.catch(async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
      throw new ParserError("URL is required", 400);
    }

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendEvent = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const existedProduct = await prisma.parsedItem.findFirst({
      where: {
        source_url: url,
      },
    });

    if (existedProduct) {
      sendEvent("status", { message: "Item found in database" });
      sendEvent("data", this.formatResponseForCLient(existedProduct));
      return res.end();
    }

    sendEvent("status", { message: "Starting parsing process..." });

    const worker = new Worker(new URL("../../workers/parser.worker.ts", import.meta.url).href);

    worker.postMessage({ url });

    worker.onmessage = async (event) => {
      const { type, data, message, status } = event.data;

      if (type === "success") {
        sendEvent("status", { message: "Parsing completed, saving to database..." });
        
        try {
          const createdProduct = await prisma.parsedItem.create({
            data
          });

          sendEvent("data", this.formatResponseForCLient(createdProduct));
        } catch (dbError: any) {
          sendEvent("error", { message: "Failed to save parsed data", details: dbError.message });
        } finally {
          worker.terminate();
          res.end();
        }
      } else if (type === "error") {
        sendEvent("error", { message, status });
        worker.terminate();
        res.end();
      }
    };

    worker.onerror = (error) => {
      console.error("Worker error:", error);
      sendEvent("error", { message: "Internal worker error" });
      worker.terminate();
      res.end();
    };

    req.on("close", () => {
      worker.terminate();
    });
  });
}

export const parserHandler = new ParserHandler();
