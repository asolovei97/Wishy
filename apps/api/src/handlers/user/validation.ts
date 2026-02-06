import { body } from "express-validator";

export class UserValidation {
  static update = [
    body("first_name").optional().notEmpty().withMessage("First name cannot be empty"),
    body("last_name").optional().notEmpty().withMessage("Last name cannot be empty"),
    body("avatar_url").optional().isURL().withMessage("Invalid Avatar URL"),
    body("settings").optional().isObject().withMessage("Settings must be an object"),
  ];
}
