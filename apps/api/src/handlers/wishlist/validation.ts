import { body } from "express-validator";

export class WishlistValidation {
  static create = [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString(),
    body("event_date").optional().isISO8601().toDate().withMessage("Invalid date format"),
    body("is_private").optional().isBoolean(),
  ];

  static update = [
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("description").optional().isString(),
    body("event_date").optional().isISO8601().toDate(),
    body("is_private").optional().isBoolean(),
  ];
}
