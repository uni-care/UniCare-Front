"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authApi } from "@/features/auth/api/auth-api";
import { AUTH_ME_QUERY_KEY, setAuthToken } from "@/features/auth/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login-schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      contactMethod: "email",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const contactMethod = useWatch({ control, name: "contactMethod" });

  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = async (values: LoginInput) => {
    setSuccessMessage("");
    setSubmitError("");

    try {
      const response = await authApi.login({
        email: values.contactMethod === "email" ? values.email : values.phoneNumber,
        password: values.password,
      });

      if (!response.data?.token) {
        throw new Error("Login succeeded but token is missing.");
      }

      setAuthToken(response.data.token);
      await queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });

      toast.success("Logged in successfully.", {
        duration: 2000,
      });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-primary/10 bg-white px-8 py-10 shadow-md shadow-primary/5">
      <p className="mb-8 text-center text-[28px] leading-tight text-neutral-700">
        Welcome back. Please enter your details.
      </p>

      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 rounded-lg border border-primary/15 bg-primary/5 p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition cursor-pointer ${contactMethod === "email" ? "bg-white text-primary shadow-sm" : "text-neutral-600"
              }`}
            type="button"
            onClick={() => setValue("contactMethod", "email", { shouldValidate: true })}
          >
            Via Email
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition cursor-pointer ${contactMethod === "phone" ? "bg-white text-primary shadow-sm" : "text-neutral-600"
              }`}
            type="button"
            onClick={() => setValue("contactMethod", "phone", { shouldValidate: true })}
          >
            Via Phone
          </button>
        </div>

        {contactMethod === "email" ? (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]" htmlFor="email">
              Email Address
            </label>
            <div className="flex items-center rounded-md border border-primary/15 px-3 focus-within:border-primary">
              <span className="material-symbols-outlined text-[20px] text-neutral-500">mail</span>
              <input
                className="w-full px-3 py-2 text-sm outline-none"
                id="email"
                placeholder="name@university.edu"
                type="email"
                {...register("email")}
              />
            </div>
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]" htmlFor="phoneNumber">
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
                  setValueAs: (value: string) => value.replace(/\D/g, "").slice(0, 10),
                })}
              />
            </div>
            {errors.phoneNumber ? <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p> : null}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#131615]" htmlFor="password">
            Password
          </label>
          <div className="flex items-center rounded-md border border-primary/15 px-3 focus-within:border-primary">
            <span className="material-symbols-outlined text-[20px] text-neutral-500">lock</span>
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
              {showPassword ? "visibility_off" : "visibility"}
            </button>
          </div>
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password.message}</p> : null}
        </div>

        <div className="text-right">
          <Link className="text-sm font-semibold text-primary hover:underline" href="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button
          className="w-full cursor-pointer rounded-full bg-primary py-3 text-2xl font-semibold text-white shadow-md shadow-primary/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>

        {successMessage ? (
          <p className="rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-center text-xs text-primary">
            {successMessage}
          </p>
        ) : null}
        {submitError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
            {submitError}
          </p>
        ) : null}

        <p className="text-center text-sm text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-primary hover:underline" href="/register">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
