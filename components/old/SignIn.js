import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/reducers/users";
import { useDispatch } from "react-redux";

export default function Signin() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleConnection = (e) => {
    e.preventDefault();
    console.log("click done");
    fetch("http://localhost:3001/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password
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
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleConnection} className="space-y-4">
            <div className="space-y-2">
              <Label name="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label name="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>

          
        </CardContent>
      </Card>
       <Link href="/login">
        <Button>Retour</Button>
      </Link>
    </div>
  );
}
