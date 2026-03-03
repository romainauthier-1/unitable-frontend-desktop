import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../reducers/users";
import {SignUp} from "@/components/ui/signup-form";
/*import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
*/
function SignUp() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [password, setSignUpPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [numSecu, setNumSecu] = useState("");
  const [contact, setContact] = useState("");
  const [adress, setAdress] = useState("");
  const [position, setPosition] = useState("");
  const [dateContract, setDateContract] = useState("");
  const [profil, setProfil] = useState("");
  const [hourVolumn, setHourVolumn] = useState("");
  const [contractType, setContractType] = useState("");

  useEffect(() => {
    setIsModalVisible(true);
  }, []);

  const handleSignUp = (e) => {
    e.preventDefault();

    // regex pour password 8 caeacteres Alphanumérique avec au moins une majuscule, une minuscule et un chiffre
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    passwordRegex.test(password) ||
      alert(
        "Le mot de passe doit comporter au moins 8 caractères, dont au moins une majuscule, une minuscule et un chiffre.",
      );
    password !== passwordConfirmation &&
      alert("Les mots de passe ne correspondent pas !");
    firstName === "" && alert("Veuillez entrer votre prénom !");
    lastName === "" && alert("Veuillez entrer votre nom !");
    email === "" && alert("Veuillez entrer votre adresse email !");
    setIsModalVisible(false);
    fetch("http://localhost:3001/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isAdmin: true,
        firstConnection: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("resultat de data", data);
        if (data.result) {
          alert("Inscription réussie !");
          dispatch(login({ email: email, token: data.token }));
          setFirstName("");
          setLastName("");
          setSignUpPassword("");
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Erreur fetch :", error);
      });
  };

  // --- JSX ---
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUp />
      </div>
    </div>
    /*<div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label name="passwordConfirmation">
                {" "}
                Confirmation Mot de passe
              </Label>
              <Input
                id="passwordConfirmation"
                type="password"
                placeholder="********"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label name="firstName"> Prenom</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="prenom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label name="lastName"> Nom</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              S'inscrire
            </Button>
          </form>
        </CardContent>
      </Card>
      <Link href="/login">
        <Button>Retour</Button>
      </Link>
    </div>*/
  );
}

export default SignUp;
/*

            
            <div className="space-y-2">
              <Label name="secuNumber"> Numero Securite Sociale</Label>
              <Input
                id="secuNumber"
                type="text"
                placeholder="n° securite sociale"
                value={numSecu}
                onChange={(e) => setNumSecu(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label name="dateContract"> Date Debut de Contrat</Label>
              <Input
                id="dateContract"
                type="date"
                placeholder="Date Debut de Contrat "
                value={dateContract}
                onChange={(e) => setDateContract(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label name="adress"> Adresse</Label>
              <Input
                id="adress"
                type="text"
                placeholder="adress"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label name="contact"> Contact</Label>
              <Input
                id="contact"
                type="text"
                placeholder="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label name="position"> Poste</Label>
              <Input
                id="position"
                type="text"
                placeholder="poste"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Profil</Label>

              <RadioGroup
                value={profil}
                onValueChange={(e) => setProfil(e)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Employe" id="employe" />
                  <Label htmlFor="employe">Employé</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label name="hourVolumn"> heure par semaine</Label>
              <Input
                id="hourVolumn"
                type="number"
                placeholder="ex: 35-39-50h"
                value={hourVolumn}
                onChange={(e) => setHourVolumn(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Profil</Label>

              <RadioGroup
                value={profil}
                onValueChange={(e) => setProfil(e)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cdi" id="cdi" />
                  <Label htmlFor="cdi">CDI</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cdd" id="cdd" />
                  <Label htmlFor="cdd">CDD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="extra" id="extra" />
                  <Label htmlFor="extra">Extra</Label>
                </div>
              </RadioGroup>
            </div> */
