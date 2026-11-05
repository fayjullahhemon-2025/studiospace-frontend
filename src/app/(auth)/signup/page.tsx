import { SignupForm } from "@/components/auth/signup-form";
import { SignupSidebar } from "@/components/auth/signup-sidebar";

export const metadata = {
  title: "Create Your Account | StudioSpace",
  description:
    "Join a global collective of directors, spatial designers, and photographers discovering spaces that inspire their next production.",
};

export default function SignupPage() {
  return (
    <main className="grid min-h-dvh grid-cols-1 lg:grid-cols-[460px_1fr]">
      <SignupSidebar />
      <div className="flex flex-col items-center justify-center bg-background px-6 py-10 sm:px-12">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
