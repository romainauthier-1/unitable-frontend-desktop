import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/users";
import { Input } from "@/components/ui/input";

export function ForgetPassword({ className, ...props }) {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmed, setPasswordConfirmed] = useState("");
	const [token, setToken] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	// et le stocker dans le state token
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);

		const tokenFromUrl = urlParams.get("token");
		if (tokenFromUrl) {
			setToken(tokenFromUrl);
		}
	}, []);
	const handlePasswordChange = (e) => {
		e.preventDefault();

		if (password !== passwordConfirmed) {
			alert("Les mots de passe ne correspondent pas !");
			return;
		}
		console.log(password, passwordConfirmed, token); // Vérifiez les valeurs avant l'appel fetch
		if (password.length > 7) {
			// je veux faire un put pour changer le mot de passe avec le token de réinitialisation  SUR LA ROUTE PUT /PASSWORD qui prend en body token et password

			fetch(`http://localhost:3000/users/password`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: token,
					password: password,
				}),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Response from password change:", data); // Vérifiez la réponse du serveur
					if (data.result) {
						setEmail("");
						setPassword("");
						setPasswordConfirmed("");
						// renvoyez vers la page dashboard ou une page de confirmation
						// window.location.href = "/dashboard"; // Vérifier le chemin si problème

						if (data.isAdmin) {
							// admin = redirection
							window.location.href = "/dashboard";
						} else {
							// employé = message
							setSuccessMessage(
								"Votre mot de passe a bien été changé, vous pouvez maintenant quitter cette page.",
							);
						}
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
			className={cn(
				"flex flex-col gap-6 max-w-[400px] mx-auto",
				className,
			)}
			{...props}
		>
			{successMessage ? (
				<p className="text-green-600 text-center">{successMessage}</p>
			) : (
				<form onSubmit={handlePasswordChange}>
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

							<h1 className="text-xl font-bold">
								Reinitialisation du mot de passe
							</h1>

							<FieldDescription>
								{" "}
								Caractères minimum 8 .
							</FieldDescription>
						</div>

						<Field>
							<FieldLabel htmlFor="password">
								Mot de passe
							</FieldLabel>
							<Input
								id="password"
								type="password"
								placeholder="Mot de passe"
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="passwordConfirmed">
								Confirmation Mot de passe
							</FieldLabel>
							<Input
								id="passwordConfirmed"
								type="password"
								placeholder="Confirmation de Mot de passe"
								onChange={(e) =>
									setPasswordConfirmed(e.target.value)
								}
								required
							/>
						</Field>
						<Field>
							<Button type="submit">
								Changer de Mot de passe
							</Button>
						</Field>
					</FieldGroup>
				</form>
			)}
		</div>
	);
}
