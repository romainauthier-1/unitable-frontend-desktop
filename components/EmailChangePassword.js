import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";

export function EmailChangePassword({ className, ...props }) {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [emailSend, setEmailSend] = useState(false);
	const handleSendEmail = (e) => {
		e.preventDefault();

		email.trim();
		email.length > 0 &&
			//  `${process.env.NEXT_PUBLIC_URL_BACKEND}/users/search/by/${encodeURIComponent(email)}`
			fetch(
				`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/search/by/` +
					encodeURIComponent(email),
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				},
			)
				.then((response) => response.json())
				.then((data) => {
					if (
						data.user != undefined &&
						data.user.token != undefined
					) {
						{
							// fetch envoie un mail de réinitialisation du mot de passe avec cette route: /emails/resetpassword
							fetch(
								`${process.env.NEXT_PUBLIC_URL_BACKEND}/emails/resetpassword`,
								{
									method: "POST",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										toEmail: email,
										toName: data.user.firstName || "", // optionnel
										tags: ["reset-password"], // optionnel
									}),
								},
							);
							setEmailSend(true);
						}
					}
				});
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
			<form onSubmit={handleSendEmail}>
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
							Réintialiser votre mot de passe
						</h1>
					</div>

					<Field>
						<FieldLabel htmlFor="email">E-mail</FieldLabel>
						<Input
							id="email"
							type="email"
							placeholder="m@exemple.com"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Field>
					<Field>
						<FieldDescription>
							Un email de réinitialisation du mot de passe sera
							envoyé si le compte existe.
						</FieldDescription>
						<Button type="submit">
							Reinitialiser le mot de passe
						</Button>
					</Field>
				</FieldGroup>
			</form>
			{emailSend && (
				<div className="p-4 mt-4 text-green-700 bg-green-100 rounded">
					Un email de réinitialisation du mot de passe a été envoyé.
				</div>
			)}
		</div>
	);
}
