import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployeeToStore,
  removeEmployeeFromStore,
  updateEmployeeInStore,
} from "../reducers/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
  FieldError,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/router";

export default function CreateEmployee() {
  const router = useRouter();
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.value?.employees) || [];
  const business = useSelector((state) => state.business.value) || [];
  const organizationId = business?.[0]?.id || "";

  const initialFormState = {
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    secuNumber: undefined,
    address: {
      street: "",
      city: "",
      zipCode: "",
    },
    phone: "",
    position: "",
    profil: "user", // Valeur par défaut sur le rôle de l'employé.e
    dateContract: "",
    typeContract: "",
    hourVolumn: "",
    contact: "",
    organization: business[0]?.id,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Gestion des inputs standards (prénom, nom, etc.)
  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Gestion pour l'adresse
  const handleAddressChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [id]: value },
    }));
  };

  // Gestion pour le select
  const handleSelectChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Gestion pour le radio group
  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, profil: value }));
  };

  // Envoie des données du formulaire
  const handleSubmit = (event) => {
    // Fetch le backend ${process.env.NEXT_PUBLIC_URL_BACKEND}/users/signup pour créer un nouvel utilisateur/employé
    event.preventDefault();

    let newErrors = {};

    if (!formData.lastName) {
      newErrors.lastName = "Le nom est obligatoire";
    }

    if (!formData.firstName) {
      newErrors.firstName = "Le prénom est obligatoire";
    }

    if (!formData.email) {
      newErrors.email = "L'email est obligatoire";
    }

    if (!formData.phone) {
      newErrors.phone = "Le téléphone est obligatoire";
    }

    if (!formData.typeContract) {
      newErrors.typeContract = "Le type de contrat est obligatoire";
    }

    if (!formData.position) {
      newErrors.position = "Le poste est obligatoire";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!organizationId) {
      setErrors((prev) => ({
        ...prev,
        organization: "Aucune organisation trouvée",
      }));
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        organization: organizationId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la création de l'employé");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Résultat ajout employé: ", data);
        if (!data.employee || !data.employee._id) {
          throw new Error("Le backend doit renvoyer l'employé avec un id");
        }

        dispatch(addEmployeeToStore(data.employee));

        setFormData(initialFormState); // Reset le formulaire après création
        console.log("Employé créé, formData : ", formData);
        console.log("Employé créé, data : ", data.employee);
        setIsDrawerOpen(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  };

  // Reset le formulaire
  const handleReset = () => {
    setFormData(initialFormState);
  };

  // supprimer un employé
  const handleDeleteEmployee = async (employeeId) => {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL_BACKEND}/employee/${employeeId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.result) {
        dispatch(removeEmployeeFromStore(employeeId)); // <- utiliser l'action du slice
        console.log("Employé supprimé :", data.employee);
      } else {
        alert("Erreur lors de la suppression : " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-background flex rounded-lg justify-evenly flex-col items-center  p-4">
      {/* <div className="mt-6">
				<h2 className="text-lg font-semibold mb-4">
					Liste des employés
				</h2>
				{employees.length === 0 ? (
					<p>Aucun employé créé.</p>
				) : (
					<div>
						{employees.map((employee) => (
							<Card key={employee._id}>
								<CardHeader>
									<CardTitle>
										{employee.firstName} {employee.lastName}
									</CardTitle>
									<CardDescription>
										{employee.position}
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-2 text-sm">
									<p>Email: {employee.email}</p>
									<p>Rôle: {employee.profil}</p>
								</CardContent>
								<CardFooter className="gap-4">
									<Button variant="outline" size="sm">
										Supprimer
									</Button>
									<Button variant="outline" size="sm">
										Modifier
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div> */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Liste des employés
        </h2>

        {employees.length === 0 ? (
          <p>Aucun employé créé.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Profil</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </TableCell>

                    <TableCell>{employee.email}</TableCell>

                    <TableCell>{employee.position}</TableCell>

                    <TableCell>
                      {employee.profil === "admin" ? (
                        <span className="text-red-600 font-semibold">
                          Admin
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          User
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee._id)}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      <Drawer
        direction="right"
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        <DrawerTrigger asChild>
          <Button variant="default">Ajouter un employé</Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ajout d'un nouvel employé</DrawerTitle>
            <DrawerDescription>
              Remplissez les informations pour ajouter un nouvel employé.
            </DrawerDescription>
          </DrawerHeader>

          <div className="no-scrollbar overflow-y-auto px-4 space-y-4">
            <form
              id="employeeForm"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Nom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                  {errors.lastName && (
                    <FieldError>{errors.lastName}</FieldError>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    Prénom <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  {errors.firstName && (
                    <FieldError>{errors.firstName}</FieldError>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jean.dupont@exemple.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
                {errors.phone && <FieldError>{errors.phone}</FieldError>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="street">Rue</Label>
                  <Input
                    id="street"
                    placeholder="1 rue de Paris"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Code postal</Label>
                  <Input
                    id="zipCode"
                    placeholder="75000"
                    value={formData.address.zipCode}
                    onChange={handleAddressChange}
                    pattern="[0-9]{5}"
                  />
                </div>
                <div className="space-y-2 col-span-3">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    placeholder="Paris"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secuNumber">Numéro de sécurité social</Label>
                <Input
                  id="secuNumber"
                  placeholder="123456789"
                  value={formData.secuNumber}
                  onChange={handleChange}
                  pattern="[1-2][0-9]{14}"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateContract">Date d'embauche</Label>
                <Input
                  id="dateContract"
                  type="date"
                  value={formData.dateContract}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Type de contrat <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("typeContract", value)
                  }
                  value={formData.typeContract}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="cdd">CDD</SelectItem>
                      <SelectItem value="cdi">CDI</SelectItem>
                      <SelectItem value="intérim">Intérim</SelectItem>
                      <SelectItem value="saisonnier">Saisonnier</SelectItem>
                      <SelectItem value="stagiaire">Stagiaire</SelectItem>
                      <SelectItem value="alternant">Alternant.e</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                  {errors.typeContract && (
                    <FieldError>{errors.typeContract}</FieldError>
                  )}
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Emploi <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("position", value)
                  }
                  value={formData.position}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un emploi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="runner">Runner</SelectItem>
                      <SelectItem value="serveur">Serveur.se</SelectItem>
                      <SelectItem value="chefRang">Chef.fe de rang</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="barman">Barman/Barmaid</SelectItem>
                      <SelectItem value="chefCuisine">
                        Chef.fe de cuisine
                      </SelectItem>
                      <SelectItem value="secondCuisine">
                        Second.e de cuisine
                      </SelectItem>
                      <SelectItem value="chefPartie">
                        Chef.fe de partie
                      </SelectItem>
                      <SelectItem value="commisCuisine">
                        Commis de cuisine
                      </SelectItem>
                      <SelectItem value="plongeur">Plongeur</SelectItem>
                      <SelectItem value="direction">Direction</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                  {errors.position && (
                    <FieldError>{errors.position}</FieldError>
                  )}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourVolumn">Volume horaire hebdomadaire</Label>
                <Input
                  id="hourVolumn"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="35"
                  value={formData.hourVolumn}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Rôle de l'employé.e <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.profil}
                  onValueChange={handleRadioChange}
                  className="max-w-sm"
                  required
                >
                  <FieldLabel htmlFor="admin">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Admin</FieldTitle>
                        <FieldDescription>
                          Idéal pour les managers.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="admin" id="admin" />
                    </Field>
                  </FieldLabel>
                  <FieldLabel htmlFor="user">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>User</FieldTitle>
                        <FieldDescription>
                          Rôle par défaut pour les employé.es.
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value="user" id="user" />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              </div>
              <DrawerFooter className="flex flex-row border-t px-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Annuler
                </Button>

                <Button type="submit" className="flex-1">
                  Créer l'employé
                </Button>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
      <Button variant="outline" onClick={() => router.push("/createTeams")}>
        Suivant
      </Button>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Création employé.es",
      description: "Enregistrez les membres de votre équipe.",
    },
  };
}
