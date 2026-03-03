import { LoginForm } from "@/components/ui/login-form";
function Index() {
  return (
    // centrer le formulaire dans la page et lui donner une largeur maximale de 400px
    <div className="w-full max-w-md">
      <LoginForm />
    </div>
  );
}

export default Index;
