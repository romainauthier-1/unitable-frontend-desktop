import styles from "../styles/BusinessForm.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addBusiness } from "../reducers/business";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Toaster } from "sonner";
import { toast } from "sonner";

export default function BusinessForm() {
  const [siret, setSiret] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCommercialName, setBusinessCommercialName] = useState("");
  const [category, setCategory] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetType, setStreetType] = useState("");
  const [streetName, setStreetName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState({});
  const [logo, setLogo] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (siret.length === 14) {
      getRestaurantInfos(siret);
    }

    // Le formulaire est automatiquement remis à zéro
    // si la plupart des inputs contiennent une info (résultat de recherche)
    // et que le siret ne contient plus que 12 chiffres (a commencé à être effacé)
    if (
      city &&
      businessName &&
      streetNumber &&
      streetName &&
      streetType &&
      zipCode &&
      siret.length <= 12
    ) {
      emptyForm();
    }
  }, [siret]);

  const validationSiret = (value) => {
    const pattern = /^[0-9]{14}$/;
    if (!pattern.test(value)) {
      setError((prev) => ({
        ...prev,
        siret: "Le SIRET doit comporter 14 chiffres",
      }));
    } else {
      setError((prev) => ({ ...prev, siret: null }));
    }
  };

  const validationPhoneNumber = (value) => {
    const pattern = /^0[1-9][0-9]{8}$/;
    if (!pattern.test(value)) {
      setError((prev) => ({
        ...prev,
        phoneNumber:
          "Le format du numéro de téléphone doit être 0612345678 ou 0712345678",
      }));
    } else {
      setError((prev) => ({ ...prev, phoneNumber: null }));
    }
  };

  const validationZipCode = (value) => {
    const pattern = /^[0-9]{5}$/;
    if (!pattern.test(value)) {
      setError((prev) => ({
        ...prev,
        zipCode: "Le code postal doit comporter 5 chiffres",
      }));
    } else {
      setError((prev) => ({ ...prev, zipCode: null }));
    }
  };

  const getRestaurantInfos = async (siret) => {
    try {
      const response = await fetch(
        `http://localhost:3000/organizations/${siret}`,
      );
      const data = await response.json();

      if (!data.result) {
        toast.error(err.message);
        console.error("Erreur: ", err.message);
      }

      const restaurant = data.restaurant;
      setBusinessName(restaurant.businessName ? restaurant.businessName : "");
      setBusinessCommercialName(
        restaurant.businessCommercialName
          ? restaurant.businessCommercialName
          : "",
      );
      setStreetNumber(
        restaurant.businessAddress.number
          ? restaurant.businessAddress.number
          : "",
      );
      setStreetType(
        restaurant.businessAddress.streetType
          ? restaurant.businessAddress.streetType
          : "",
      );
      setStreetName(
        restaurant.businessAddress.streetName
          ? restaurant.businessAddress.streetName
          : "",
      );
      setZipCode(
        restaurant.businessAddress.zipCode
          ? restaurant.businessAddress.zipCode
          : "",
      );
      setCity(
        restaurant.businessAddress.city ? restaurant.businessAddress.city : "",
      );
    } catch (err) {
      toast.error(err.message);
      console.error("Erreur: ", err.message);
    }
  };

  //   const addLogo = () => {
  //     formData = new FormData();
  //     formData.append("logo", logo);
  //   };

  const handleSubmit = async (
    e,
    siret,
    businessName,
    businessCommercialName,
    streetNumber,
    streetType,
    streetName,
    zipCode,
    city,
    phoneNumber,
    owner, // attente du token
    category,
  ) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siret: siret,
        businessName: businessName,
        businessCommercialName: businessCommercialName,
        businessAddress: {
          number: streetNumber,
          streetType: streetType,
          streetName: streetName,
          zipCode: zipCode,
          city: city,
        },
        phoneNumber: phoneNumber,
        owner: "JOHN DOE",
        category: category,
      }),
    });
    const data = await response.json();

    if (!data.result) {
      toast.warning(data.message);
      // alert(data.message);
      console.error(data.message);
    } else {
      dispatch(addBusiness({ businessCommercialName, owner }));
      emptyForm();
      toast.success(data.message);
      console.log(data.message);
    }
  };

  const emptyForm = () => {
    setSiret("");
    setBusinessName("");
    setBusinessCommercialName("");
    setCategory("");
    setStreetNumber("");
    setStreetType("");
    setStreetName("");
    setZipCode("");
    setCity("");
    setPhoneNumber("");
  };

  return (
    <div className="min-h-screen bg-blue-primary flex items-center justify-center p-4">
      <Toaster richColors />
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-blue-light">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Renseignez les informations de votre établissement
        </h1>
        <form
          onSubmit={(e) =>
            handleSubmit(
              e,
              siret,
              businessName,
              businessCommercialName,
              streetNumber,
              streetType,
              streetName,
              zipCode,
              city,
              phoneNumber,
              category,
            )
          }
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <Label>SIRET</Label>
              <Input
                className="mt-1"
                placeholder="Numéro SIRET"
                type="text"
                inputMode="numeric"
                onChange={(e) => setSiret(e.target.value)}
                value={siret}
                onBlur={(e) => validationSiret(e.target.value)}
                required
              />

              {error.siret && (
                <p className="text-destructive text-xs mt-1">{error.siret}</p>
              )}
            </Field>

            <Field>
              <Label>Nom de la société</Label>
              <Input
                className="mt-1"
                required
                placeholder="Nom de la société"
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
              />
            </Field>

            <Field>
              <Label>Nom de l'établissement</Label>
              <Input
                className="mt-1"
                required
                placeholder="Nom de l'établissement"
                onChange={(e) => setBusinessCommercialName(e.target.value)}
                value={businessCommercialName}
              />
            </Field>
            <Field>
              <Label>Catégorie</Label>
              <Select
                onValueChange={(value) => setCategory(value)}
                value={category}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choisir une catégorie"></SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    <SelectItem value="Bar">Bar</SelectItem>
                    <SelectItem value="Restaurant traditionnel">
                      Restaurant traditionnel
                    </SelectItem>
                    <SelectItem value="Brasserie">Brasserie</SelectItem>
                    <SelectItem value="Restaurant à thème">
                      Restaurant à thème
                    </SelectItem>
                    <SelectItem value="Restaurant gastronomique">
                      Restaurant gastronomique
                    </SelectItem>
                    <SelectItem value="Resaurant saisonnier">
                      Resaurant saisonnier
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-1">
              <Label>N°</Label>
              <Input
                placeholder="478"
                inputMode="numeric"
                onChange={(e) => setStreetNumber(e.target.value)}
                value={streetNumber}
              />
            </div>

            <div className="col-span-1">
              <Label>Type de voie</Label>
              <Input
                placeholder="Rue, allée..."
                onChange={(e) => setStreetType(e.target.value)}
                value={streetType}
              />
            </div>
            <div className="col-span-2">
              <Label>Nom de la voie</Label>
              <Input
                placeholder="Jean Monnet"
                onChange={(e) => setStreetName(e.target.value)}
                value={streetName}
              />
            </div>
            <div className="col-span-1">
              <Label>Code Postal</Label>
              <Input
                placeholder="13005"
                inputMode="numeric"
                onChange={(e) => setZipCode(e.target.value)}
                onBlur={(e) => validationZipCode(e.target.value)}
                value={zipCode}
              />
              {error.zipCode && (
                <p className={styles.errorMessage}>{error.zipCode}</p>
              )}
            </div>
            <div className="col-span-1">
              <Label>Ville</Label>
              <Input
                placeholder="Ville"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>
            <div className="col-span-2">
              <Label>Numéro de téléphone</Label>
              <Input
                required
                inputMode="numeric"
                placeholder="Numéro de téléphone"
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={(e) => validationPhoneNumber(e.target.value)}
                value={phoneNumber}
              />
              {error.phoneNumber && (
                <p className={styles.errorMessage}>{error.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* <input
            id="logo"
            className={styles.formInput}
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            ></input> */}
          <Field className="flex-row items-center justify-between gap-4 pt-4 border-t">
            <Button type="button" variant="ghost" onClick={emptyForm}>
              Vider tous les champs
            </Button>
            <Button type="submit" className="px-8">
              Valider
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
}
