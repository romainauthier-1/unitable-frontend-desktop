import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/users";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleConnection = (e) => {
    e.preventDefault();
    console.log("click done");
    console.log("Email:", email);
    console.log("Password:", password);
    if (password.length > 1 && email.length > 0) {
      fetch("http://localhost:3000/users/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.result) {
            dispatch(login({ email: email, token: data.token }));
            setEmail("");
            setPassword("");
            console.log(data.result);
          }
        });
    } else {
      alert(
        "Veuillez entrer un email et un mot de passe d'au moins 8 caractères.",
      );
      return;
    }
  };
  return (
    // centrer le formulaire dans la page et lui donner une largeur maximale de 400px
    <div
      className={cn("flex flex-col gap-6 max-w-[400px] mx-auto", className)}
      {...props}
    >
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">UniTable</span>
            </a>

            <h1 className="text-xl font-bold">Reinitialisation du mot de passe</h1>

            <FieldDescription> Caractères minimum 8 .</FieldDescription>
          
          </div>

          <Field>
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
                    <Field>
            <FieldLabel htmlFor="passwordConfirmed">Confirmation Mot de passe</FieldLabel>
            <Input
              id="passwordConfirmed"
              type="password"
              placeholder="Confirmation de Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit" onClick={handleConnection}>
              Se connecter
            </Button>
          </Field>

         
        </FieldGroup>
      </form>

      
    </div>
  );
}
