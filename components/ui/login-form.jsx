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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/reducers/users";
import { setServices, addService } from "@/reducers/services";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/router";
import { addBusiness, addReferenceTeams } from "@/reducers/business";
import { addEmployeeToStore, setEmployeesInStore } from "@/reducers/employee";

export function LoginForm({ className, ...props }) {
	const dispatch = useDispatch();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [businessId, setBusinessId] = useState("");
	const handleConnection = (e) => {
		e.preventDefault();

    if (password.length > 1 && email.length > 0) {
      fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
    
          if (data.result) {
            // recuperer organisation de l'utilisateur et l'ajouter au store
            // fetch user search by email to get organization id, then fetch organization by id to get organization details and add to store
            fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/search/by/${email}`)
              .then((response) => response.json())
              .then((userData) => {
              
                if (userData.result && userData.user?.organization) {
                  const organizationId = userData.user.organization;
                  const name =
                    userData.user.firstName + " " + userData.user.lastName;
                  dispatch(
                    login({
                      email,
                      token: data.token,
                      name: name,
                      id: userData.user._id,
                    }),
                  );
                  fetch(
                    `${process.env.NEXT_PUBLIC_URL_BACKEND}/organizations/search/by/${organizationId}`,
                  )
                    .then((response) => response.json())
                    .then((organizationData) => {
                      
                      if (
                        organizationData.result &&
                        organizationData.organization
                      ) {
                        const {
                          businessCommercialName,
                          owner,
                          _id,
                          referenceTeams,
                          businessAddress,
                        } = organizationData.organization;
                        const zipCode = businessAddress?.zipCode;
                        dispatch(
                          addBusiness({
                            businessCommercialName,
                            owner,
                            id: _id,
                            referenceTeams: referenceTeams,
                            zipCode: zipCode,
                          }),
                        );
                      }
                    });
                  fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/services/${organizationId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  })
                    .then((response) => response.json())
                    .then((servicesData) => {
                   
                      dispatch(setServices(servicesData.services || []));
                    });

                  fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/employee/${organizationId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  })
                    .then((response) => response.json())
                    .then((employeesData) => {
                     
                      dispatch(
                        setEmployeesInStore(employeesData.employees || []),
                      );
                    });
                }
                if (!userData.result) {
                  console.error(
                    "Reponse invalide pour la recherche de l'utilisateur par email:",
                    userData,
                  );
                  return;
                }
              });
          

						setEmail("");
						setPassword("");
						router.push("/dashboard");
					}
				});
		} else {
			alert(
				"Veuillez entrer un email et un mot de passe d'au moins 8 caractères.",
			);
		}
	};

	return (
		<div
			className={cn(
				"flex min-h-svh w-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10",
				className,
			)}
			{...props}
		>
			<div className="w-full max-w-125">
				<Card>
					<CardContent>
						<form onSubmit={handleConnection}>
							<FieldGroup>
								<div className="flex flex-col items-center gap-2 text-center">
									<a
										href="#"
										className="flex flex-col items-center gap-2 font-medium"
									>
										<div className="flex size-8 items-center justify-center rounded-md">
											<GalleryVerticalEnd className="size-6" />
										</div>
										<span className="sr-only">
											UniTable
										</span>
									</a>

									<h1 className="text-xl font-bold">
										Bienvenue chez UniTable
									</h1>

									<FieldDescription>
										Vous n'avez pas de compte ?{" "}
										<a href="/signup">S&apos;inscrire</a>
									</FieldDescription>
								</div>

								<Field>
									<FieldLabel htmlFor="email">
										E-mail
									</FieldLabel>
									<Input
										id="email"
										type="email"
										placeholder="m@exemple.com"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="password">
										Mot de passe
									</FieldLabel>
									<Input
										id="password"
										type="password"
										placeholder="Mot de passe"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
									/>
									<Link
										href="/sendEmailPassword"
										className="ml-auto text-sm underline-offset-2 hover:underline hover:text-primary"
									>
										Mot de passe oublié ?
									</Link>
								</Field>
								<Field>
									<Button type="submit">Se connecter</Button>
								</Field>

								<FieldSeparator>Ou</FieldSeparator>

								<Field className="grid gap-4 sm:grid-cols-2">
									<Button
										variant="outline"
										type="button"
										disabled
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
										>
											<path
												d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
												fill="currentColor"
											/>
										</svg>
										Continuer avec Apple
									</Button>

									<Button
										variant="outline"
										type="button"
										disabled
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
										>
											<path
												d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
												fill="currentColor"
											/>
										</svg>
										Continuer avec Google
									</Button>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
					<FieldDescription className="px-6 pb-6 text-center">
						En cliquant sur continuer, vous acceptez nos{" "}
						<a href="#">Conditions d&apos;utilisation</a> et notre{" "}
						<a href="#">Politique de confidentialité</a>.
					</FieldDescription>
				</Card>
			</div>
		</div>
	);
}
