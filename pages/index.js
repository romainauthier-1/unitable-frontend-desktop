import { LoginForm } from "@/components/ui/login-form";
//import Dashboard from "@/components/ui/dashboard";
function Index() {
  //return LoginForm dans une div pour éviter les problèmes de style et centrer au coeur de la page
  //  <LoginForm />;  <Dashboard />;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}

export default Index;

export async function getStaticProps() {
  return {
    props: {
      title: "Connexion",
      description: "Connectez-vous pour accéder à l'application",
    },
  };
}
