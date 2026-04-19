import { CreateAccountForm } from "@/features/auth/components/create-account-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background-light px-4 py-16">
      <CreateAccountForm />
    </main>
  );
}
