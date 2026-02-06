import { body } from "express-validator";

export class ItemValidation {
  static create = [
    body("name").optional().notEmpty().withMessage("Name is required if not parsing"),
    body("source_url").optional().isURL().withMessage("Invalid URL"),
  ];

  static update = [
    body("name").optional().notEmpty(),
    body("description").optional(),
    body("price").optional().isNumeric(),
    body("currency").optional().isLength({ min: 3, max: 3 }),
    body("source_url").optional().isURL(),
    body("imageUrl").optional().isURL(),
  ];
}
