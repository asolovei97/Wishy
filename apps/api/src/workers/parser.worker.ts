import { parserFactory } from "../services/parser/factory";

declare var self: Worker;

self.onmessage = async (event: MessageEvent) => {
  const { url } = event.data;

  try {
    const parser = parserFactory.getParser(url);
    const data = await parser.parse(url);
    self.postMessage({ type: "success", data });
  } catch (error: any) {
    self.postMessage({ 
      type: "error", 
      message: error.message || "Unknown parsing error",
      status: error.status || 500
    });
  }
};
