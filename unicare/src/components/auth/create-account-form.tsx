"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { authApi } from "@/api/auth-api";
import { registerSchema, type RegisterInput } from "@/types/auth-schemas";
import { RegistrationMethod } from "@/types/auth";
import { useRouter } from "@/i18n/routing";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

export function CreateAccountForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "student",
      contactMethod: "phone",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptedPolicy: false,
    },
  });
  const role = useWatch({ control, name: "role" });
  const contactMethod = useWatch({ control, name: "contactMethod" });

  const onSubmit = async (values: RegisterInput) => {
    try {
      await authApi.register({
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        password: values.password,
        registrationMethod:
          values.contactMethod === "email"
            ? RegistrationMethod.Email
            : RegistrationMethod.Phone,
        email: values.contactMethod === "email" ? values.email : undefined,
        phoneNumber:
          values.contactMethod === "phone" ? values.phoneNumber : undefined,
      });
      toast.success("Account created successfully. You can now sign in.", {
        duration: 2000,
      });
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create account. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-primary/10 bg-white px-8 py-10 shadow-md shadow-primary/5">
      <h1 className="mb-1 text-center text-4xl font-bold leading-none text-[#131615] sm:text-3xl">
        Create Account
      </h1>
      <p className="mb-7 text-center text-sm text-neutral-500">
        Unlock your academic and professional potential.
      </p>

      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 rounded-lg border border-primary/15 bg-primary/5 p-1">
          <button
            className={`rounded-md cursor-pointer px-4 py-2 text-sm font-semibold transition ${role === "student" ? "bg-primary/10 text-[#131615]" : "text-neutral-600"}`}
            type="button"
            onClick={() =>
              setValue("role", "student", { shouldValidate: true })
            }
          >
            Student
          </button>
          <button
            className={`rounded-md cursor-pointer px-4 py-2 text-sm font-semibold transition ${role === "alumni" ? "bg-white text-primary shadow-sm" : "text-neutral-600"}`}
            type="button"
            onClick={() => setValue("role", "alumni", { shouldValidate: true })}
          >
            Alumni
          </button>
        </div>

        <div className="grid grid-cols-2 border-b border-primary/10">
          <button
            className={`pb-2 text-sm cursor-pointer font-semibold transition ${contactMethod === "email" ? "border-b-2 border-primary text-primary" : "text-neutral-500"}`}
            type="button"
            onClick={() =>
              setValue("contactMethod", "email", { shouldValidate: true })
            }
          >
            Via Email
          </button>
          <button
            className={`pb-2 text-sm cursor-pointer font-semibold transition ${contactMethod === "phone" ? "border-b-2 border-primary text-primary" : "text-neutral-500"}`}
            type="button"
            onClick={() =>
              setValue("contactMethod", "phone", { shouldValidate: true })
            }
          >
            Via Phone
          </button>
        </div>

        {contactMethod === "phone" ? (
          <div>
            <label
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <div className="flex rounded-md border border-primary/15 focus-within:border-primary">
              <div className="flex items-center gap-1 border-r border-primary/15 px-3 text-sm text-neutral-600">
                <span>🇪🇬</span>
                <span>+20</span>
              </div>
              <input
                className="w-full px-3 py-2 text-sm outline-none"
                id="phoneNumber"
                inputMode="numeric"
                maxLength={10}
                placeholder="1012345678"
                type="tel"
                {...register("phoneNumber", {
                  setValueAs: (value: string) =>
                    value.replace(/\D/g, "").slice(0, 10),
                })}
              />
            </div>
            {errors.phoneNumber ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.phoneNumber.message}
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <label
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-md border border-primary/15 px-3 py-2 text-sm outline-none transition focus:border-primary"
              id="email"
              placeholder="you@university.edu"
              type="email"
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="w-full rounded-md border border-primary/35 px-3 py-2 text-sm outline-none transition focus:border-primary"
              id="firstName"
              placeholder="Ziad"
              type="text"
              {...register("firstName")}
            />
            {errors.firstName ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="w-full rounded-md border border-primary/35 px-3 py-2 text-sm outline-none transition focus:border-primary"
              id="lastName"
              placeholder="Nasser"
              type="text"
              {...register("lastName")}
            />
            {errors.lastName ? (
              <p className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]"
            htmlFor="password"
          >
            Password
          </label>
          <div className="flex items-center rounded-md border border-primary/15 pr-2 focus-within:border-primary">
            <input
              className="w-full px-3 py-2 text-sm outline-none"
              id="password"
              placeholder="........"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="material-symbols-outlined cursor-pointer text-neutral-500"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </button>
          </div>
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="flex items-center rounded-md border border-primary/35 pr-2 focus-within:border-primary">
            <input
              className="w-full px-3 py-2 text-sm outline-none"
              id="confirmPassword"
              placeholder="........"
              type="password"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword ? (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input
            className="mt-0.5"
            type="checkbox"
            {...register("acceptedPolicy")}
          />
          <span>
            I agree to the{" "}
            <span className="font-medium text-primary">Terms & Conditions</span>{" "}
            and <span className="font-medium text-primary">Privacy Policy</span>
          </span>
        </label>
        {errors.acceptedPolicy ? (
          <p className="text-xs text-red-600">
            {errors.acceptedPolicy.message}
          </p>
        ) : null}

        <button
          className="w-full rounded-full cursor-pointer bg-primary py-3 text-base font-semibold text-white shadow-md shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            className="font-semibold text-primary hover:underline"
            href="/login"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
