import React from "react";
//import SignUp from "../components/SignUp" // adapte si ton fichier est ailleurs
import SignUpForm from "@/components/ui/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
