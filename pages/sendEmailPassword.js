// utiliser EmailChangePassword pour envoyer un mail de réinitialisation du mot de passe
import { EmailChangePassword } from "@/components/EmailChangePassword";

function SendEmailPasswordForm() {
  return (
    // centrer le formulaire dans la page et lui donner une largeur maximale de 400px
    <div className="w-full max-w-md">
      <EmailChangePassword />
    </div>
  );
}

export default SendEmailPasswordForm;
