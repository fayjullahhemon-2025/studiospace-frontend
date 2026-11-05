import { LoginForm } from "@/components/auth/login-form";
import { LoginSidebar } from "@/components/auth/login-sidebar";

export const metadata = {
  title: "Sign In | StudioSpace",
  description:
    "Sign in to access your saved studios, call sheets, and booking history.",
};

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh grid-cols-1 lg:grid-cols-[460px_1fr]">
      <LoginSidebar />
      <div className="flex flex-col items-center justify-center bg-background px-6 py-10 sm:px-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
