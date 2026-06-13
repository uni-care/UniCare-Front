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

export const registerSchema = z
  .object({
    role: z.enum(["student", "alumni"]),
    contactMethod: z.enum(["email", "phone"]),
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().min(2, "Last name must be at least 2 characters."),
    email: z.string().trim(),
    phoneNumber: z.string().trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[a-z]/, "Password must include at least one lowercase letter.")
      .regex(/[0-9]/, "Password must include at least one number."),
    confirmPassword: z.string(),
    acceptedPolicy: z
      .boolean()
      .refine((value) => value, "You must accept the terms and privacy policy."),
  })
  .superRefine((values, context) => {
    if (values.contactMethod === "email") {
      const emailValidation = z.string().email("Please enter a valid university email address.");
      const result = emailValidation.safeParse(values.email);

      if (!result.success) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Please enter a valid university email address.",
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
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
