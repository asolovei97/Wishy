import { ParsedItem } from "@api/generated/prisma/client";
import { BaseHandler } from "../base";

export abstract class  BaseParserHandler extends BaseHandler{
    protected formatResponseForCLient(product: ParsedItem) {
        return {
            name: product.name,
            price: product.price,
            currency: product.currency,
            image_url: product.imageUrl,
            description: product.description,
            source_url: product.source_url,
        };
    }
}