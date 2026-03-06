import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/users";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { Toaster } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:3000";

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
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-125">
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
                  8 Caractères minimum, avec au moins une majuscule, une
                  minuscule et un chiffre.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium"
                >
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

              {/* <div className="grid gap-4 sm:grid-cols-2">
								<Button className="w-full" type="submit">
									Créer mon compte
								</Button>

								<Button
									className="w-full"
									variant="outline"
									type="button"
									disabled
									onClick={() =>
										alert(
											"Soyez Patient, bientôt disponible !",
										)
									}
								>
									S'enregistrer avec Google
								</Button>
							</div>
							<p className="px-6 text-center text-xs text-muted-foreground">
								Déjà un compte ?{" "}
								<a className="underline" href="/login">
									Se connecter
								</a>
							</p> */}
              <FieldGroup>
                <Field>
                  <Button className="w-full" type="submit">
                    Créer mon compte
                  </Button>
                </Field>

                <FieldSeparator>Ou</FieldSeparator>

                <Field className="grid gap-4 sm:grid-cols-2">
                  <Button variant="outline" type="button" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    S'inscrire avec Apple
                  </Button>

                  <Button variant="outline" type="button" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    S'inscrire avec Google
                  </Button>
                </Field>
                <p className="px-6 text-center text-xs text-muted-foreground">
                  Déjà un compte ?{" "}
                  <a className="underline" href="/login">
                    Se connecter
                  </a>
                </p>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
