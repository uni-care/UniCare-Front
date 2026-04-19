import { z } from "zod";

export const loginSchema = z
  .object({
    contactMethod: z.enum(["email", "phone"]),
    email: z.string().trim(),
    phoneNumber: z.string().trim(),
    password: z.string().min(1, "Password is required."),
  })
  .superRefine((values, context) => {
    if (values.contactMethod === "email") {
      const emailValidation = z.string().email("Please enter a valid email address.");
      const result = emailValidation.safeParse(values.email);

      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Please enter a valid email address.",
        });
      }
    }

    if (values.contactMethod === "phone" && !/^1[0125]\d{8}$/.test(values.phoneNumber)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phoneNumber"],
        message: "Please enter a valid Egyptian phone number (10 digits).",
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
