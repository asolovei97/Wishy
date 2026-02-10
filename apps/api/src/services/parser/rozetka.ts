import puppeteer from "puppeteer";
import { ParsedProduct, ParserService } from "./types";
import { ParserError } from "./errors";

export class RozetkaParserService implements ParserService {
  public async parse(url: string): Promise<ParsedProduct> {
    if (!this.isValidUrl(url)) {
      throw ParserError.invalidUrl();
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled"
        ],
      });

      const page = await browser.newPage();
      
      // Set User Agent to mimic a real browser
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // Set extra headers
      await page.setExtraHTTPHeaders({
        "Accept-Language": "uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7",
      });

      // Navigate with generous timeout
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      if (!response || !response.ok()) {
         const status = response ? response.status() : 500;
         if (status >= 400) throw ParserError.fetchFailed(status);
      }

      // Extract Data using in-browser evaluation
      const data = await page.evaluate(() => {
        const jsonLdElement = document.querySelector('script[type="application/ld+json"]');
        let product: any = null;
        
        // Try JSON-LD First
        if (jsonLdElement && jsonLdElement.textContent) {
          try {
             const json = JSON.parse(jsonLdElement.textContent);
             if (Array.isArray(json)) {
                 product = json.find(i => i["@type"] === "Product");
             } else if (json["@type"] === "Product") {
                 product = json;
             }
          } catch (e) {}
        }
        
        // Fallback DOM scraping
        const name = 
            product?.name || 
            document.querySelector('h1')?.innerText || 
            "";

        const offers = Array.isArray(product?.offers) ? product.offers[0] : product?.offers;
        
        // Price scrubbing
        const priceStr = 
            offers?.price || 
            document.querySelector('.product-price__big')?.textContent?.replace(/[^0-9.]/g, "") ||
            document.querySelector('p.product-prices__big')?.textContent?.replace(/[^0-9.]/g, "") ||
            "0";
            
        const currency = offers?.priceCurrency || "UAH";
        
        const image_url = 
            product?.image || 
            document.querySelector('head')?.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
            document.querySelector('.product-photo__picture')?.getAttribute('src') || 
            "";
            
        const description = 
             product?.description || 
             document.querySelector('head')?.querySelector('meta[name="description"]')?.getAttribute('content') ||
             document.querySelector('#description .text-content')?.textContent?.trim() || 
             "";

        return {
            name,
            price: parseFloat(priceStr) || 0,
            currency,
            image_url,
            description: description ? description.substring(0, 1000) : "",
        };
      });

      return {
        ...data,
        source_url: url
      };

    } catch (error) {
        if (error instanceof ParserError) throw error;
        console.error("Puppeteer Error:", error);
        throw ParserError.parsingFailed((error as any).message);
    } finally {
        if (browser) await browser.close();
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.hostname.includes("rozetka.com.ua");
    } catch {
      return false;
    }
  }
}

export const rozetkaParser = new RozetkaParserService();