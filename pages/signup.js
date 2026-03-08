import React from "react";
//import SignUp from "../components/SignUp" // adapte si ton fichier est ailleurs
import SignUpForm from "@/components/ui/signup-form";

export default function SignupPage() {
  return <SignUpForm />;
}

export async function getStaticProps() {
  return {
    props: {
      title: "Inscription",
      description: "Créez votre compte pour accéder à l'application",
    },
  };
}
