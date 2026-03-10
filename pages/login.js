import { LoginForm } from "@/components/ui/login-form";
function Index() {
  return (
    // centrer le formulaire dans la page et lui donner une largeur maximale de 400px

    <LoginForm />
  );
}

export default Index;

export async function getStaticProps() {
  return {
    props: {
      title: "Connexion",
      description: "Connectez-vous pour accéder à l'application.",
    },
  };
}
