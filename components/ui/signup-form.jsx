import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/users";
import { useRouter } from "next/router";

export default function SignUpForm(props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [password, setSignUpPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    // Créer si besoin
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      alert(
        "Le mot de passe doit comporter au moins 8 caractères, dont au moins une majuscule, une minuscule et un chiffre.",
      );
      return;
    }

    if (password !== passwordConfirmation) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    if (!firstName.trim()) {
      alert("Veuillez entrer votre prénom !");
      return;
    }

    if (!lastName.trim()) {
      alert("Veuillez entrer votre nom !");
      return;
    }

    if (!email.trim()) {
      alert("Veuillez entrer votre adresse email !");
      return;
    }

    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        isAdmin: true,
        firstConnection: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          alert("Inscription réussie !");
          dispatch(login({ email, token: data.token }));
          setFirstName("");
          setLastName("");
          setEmail("");
          setSignUpPassword("");
          setPasswordConfirmation("");
          router.push("/businessForm");
        } else {
          alert(data.error || "Inscription échouée.");
        }
      })
      .catch((error) => {
        console.error("Erreur fetch :", error);
        alert("Erreur serveur.");
      });
  };

  return (
    // remplace tous les textes en français

    <Card {...props}>
      <CardHeader>
        <CardTitle>Creation de Compte</CardTitle>
        <CardDescription>
          Entrez vos informations ci-dessous pour créer votre compte
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Nom
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Prénom
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              L'email sert d'identifiant pour votre compte et doit être au
              format valide (ex: nom@gmail.com)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              8 Caractères minimum, avec au moins une majuscule, une minuscule
              et un chiffre.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirmer le mot de passe
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Veuillez confirmer votre mot de passe
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Button className="w-full" type="submit">
              Créer mon compte
            </Button>

            <Button
              className="w-full"
              variant="outline"
              type="button"
              disabled
              onClick={() => alert("Soyez Patient, bientôt disponible !")}
            >
              S'enregistrer avec Google
            </Button>

            <p className="px-6 text-center text-xs text-muted-foreground">
              Déjà un compte ?{" "}
              <a className="underline" href="/login">
                Se connecter
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
