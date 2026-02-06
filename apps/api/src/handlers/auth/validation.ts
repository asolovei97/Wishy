import { body } from "express-validator";

export class AuthValidation {
  static create = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("first_name").notEmpty().withMessage("First name is required"),
  ];

  static updatePassword = [
    body("current_password").notEmpty().withMessage("Current password is required"),
    body("new_password")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ];
}