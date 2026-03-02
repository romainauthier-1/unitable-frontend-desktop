import styles from "../styles/CreationEntiteForm.module.css";
import { useState, useEffect } from "react";

export default function CreationEntiteForm() {
  const [siret, setSiret] = useState("");
  const [nomSociete, setNomSociete] = useState("");
  const [nomEnseigne, setNomEnseigne] = useState("");
  const [categorie, setCategorie] = useState("");
  const [numeroVoie, setNumeroVoie] = useState("");
  const [typeVoie, setTypeVoie] = useState("");
  const [libelleVoie, setLibelleVoie] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [telephone, setTelephone] = useState("");
  const [logo, setLogo] = useState(null);
  const [error, setError] = useState({});

  useEffect(() => {
    if (siret.length === 14) {
      getRestaurantInfos(siret);
    }

    // Le formulaire est automatiquement remis à zéro
    // si chaque input contient une info (résultat de recherche)
    // et que le siret ne contient plus que 12 chiffres
    if (
      ville &&
      nomSociete &&
      nomEnseigne &&
      numeroVoie &&
      typeVoie &&
      libelleVoie &&
      codePostal &&
      ville &&
      siret.length <= 12
    ) {
      setNomSociete("");
      setNomEnseigne("");
      setCategorie("");
      setNumeroVoie("");
      setTypeVoie("");
      setLibelleVoie("");
      setCodePostal("");
      setVille("");
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

  const validationTelephone = (value) => {
    const pattern = /^0[1-9][0-9]{8}$/;
    if (!pattern.test(value)) {
      setError((prev) => ({
        ...prev,
        telephone:
          "Le format du numéro de téléphone doit être 0612345678 ou 0712345678",
      }));
    } else {
      setError((prev) => ({ ...prev, telephone: null }));
    }
  };

  const validationCodePostal = (value) => {
    const pattern = /^[0-9]{5}$/;
    if (!pattern.test(value)) {
      setError((prev) => ({
        ...prev,
        CP: "Le code postal doit comporter 5 chiffres",
      }));
    } else {
      setError((prev) => ({ ...prev, CP: null }));
    }
  };

  const getRestaurantInfos = async (siret) => {
    try {
      const response = await fetch(`http://localhost:3000/entites/${siret}`);
      const data = await response.json();

      if (!data.result) {
        console.error("Erreur: ", err.message);
      }

      const restaurant = data.restaurant;
      setNomSociete(restaurant.nomSociete ? restaurant.nomSociete : "");
      setNomEnseigne(restaurant.nomCommercial ? restaurant.nomCommercial : "");
      setNumeroVoie(
        restaurant.adresse.numeroVoie ? restaurant.adresse.numeroVoie : "",
      );
      setTypeVoie(
        restaurant.adresse.typeVoie ? restaurant.adresse.typeVoie : "",
      );
      setLibelleVoie(
        restaurant.adresse.libelleVoie ? restaurant.adresse.libelleVoie : "",
      );
      setCodePostal(restaurant.adresse.CP ? restaurant.adresse.CP : "");
      setVille(restaurant.adresse.ville ? restaurant.adresse.ville : "");
    } catch (err) {
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
    nomSociete,
    nomEnseigne,
    numeroVoie,
    typeVoie,
    libelleVoie,
    CP,
    ville,
    telephone,
    // proprietaire, attente du token
    categorie,
  ) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/entites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siret: siret,
        nomSociete: nomSociete,
        nomEnseigne: nomEnseigne,
        adresseSociete: {
          numeroVoie: numeroVoie,
          typeVoie: typeVoie,
          libelleVoie: libelleVoie,
          CP: CP,
          ville: ville,
        },
        telephone: telephone,
        proprietaire: "TEST",
        categorie: categorie,
      }),
    });
    const data = await response.json();

    if (!data.result) {
      alert(data.message);
      console.log(data.message);
    } else {
      emptyForm();
    }
  };

  const emptyForm = () => {
    setSiret("");
    setNomSociete("");
    setNomEnseigne("");
    setCategorie("");
    setNumeroVoie("");
    setTypeVoie("");
    setLibelleVoie("");
    setCodePostal("");
    setVille("");
    setTelephone("");
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>
        Renseignez les informations de votre établissement
      </h1>
      <div className={styles.formContainer}>
        <form>
          <input
            className={error.siret ? styles.missingInput : styles.formInput}
            placeholder="Numéro SIRET"
            type="text"
            inputMode="numeric"
            onChange={(e) => setSiret(e.target.value)}
            value={siret}
            onBlur={(e) => validationSiret(e.target.value)}
            required
          ></input>
          {error.siret && <p className={styles.errorMessage}>{error.siret}</p>}
          <input
            required
            className={
              nomSociete === "" ? styles.missingInput : styles.formInput
            }
            placeholder="Nom de la société"
            onChange={(e) => setNomSociete(e.target.value)}
            value={nomSociete}
          ></input>
          <input
            required
            className={
              nomEnseigne === "" ? styles.missingInput : styles.formInput
            }
            placeholder="Nom de l'enseigne"
            onChange={(e) => setNomEnseigne(e.target.value)}
            value={nomEnseigne}
          ></input>
          <select
            className={styles.formInput}
            onChange={(e) => setCategorie(e.target.value)}
            value={categorie}
          >
            <option value="">Choisissez votre catégorie</option>
            <option value="Bar">Bar</option>
            <option value="Restaurant traditionnel">
              Restaurant traditionnel
            </option>
            <option value="Brasserie">Brasserie</option>
            <option value="Restaurant à thème">Restaurant à thème</option>
            <option value="Restaurant gastronomique">
              Restaurant gastronomique
            </option>
            <option value="Resaurant saisonnier">Resaurant saisonnier</option>
          </select>
          <input
            className={styles.formInput}
            placeholder="N°"
            inputMode="numeric"
            onChange={(e) => setNumeroVoie(e.target.value)}
            value={numeroVoie}
          ></input>
          <input
            className={styles.formInput}
            placeholder="Type de voie"
            onChange={(e) => setTypeVoie(e.target.value)}
            value={typeVoie}
          ></input>
          <input
            className={styles.formInput}
            placeholder="Libellé de voie"
            onChange={(e) => setLibelleVoie(e.target.value)}
            value={libelleVoie}
          ></input>
          <input
            className={styles.formInput}
            placeholder="Code postal"
            inputMode="numeric"
            onChange={(e) => setCodePostal(e.target.value)}
            onBlur={(e) => validationCodePostal(e.target.value)}
            value={codePostal}
          ></input>
          {error.CP && <p className={styles.errorMessage}>{error.CP}</p>}

          <input
            className={styles.formInput}
            placeholder="Ville"
            onChange={(e) => setVille(e.target.value)}
            value={ville}
          ></input>
          <input
            required
            inputMode="numeric"
            className={
              error.telephone || telephone === ""
                ? styles.missingInput
                : styles.formInput
            }
            placeholder="Numéro de téléphone"
            onChange={(e) => setTelephone(e.target.value)}
            onBlur={(e) => validationTelephone(e.target.value)}
            value={telephone}
          ></input>
          {error.telephone && (
            <p className={styles.errorMessage}>{error.telephone}</p>
          )}

          {/* <input
            id="logo"
            className={styles.formInput}
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
          ></input> */}
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              title="Vider tous les champs"
              onClick={emptyForm}
            >
              Vider tous les champs
            </button>
            <button
              className={styles.button}
              type="submit"
              title="Étape suivante"
              onClick={(e) =>
                handleSubmit(
                  e,
                  siret,
                  nomSociete,
                  nomEnseigne,
                  numeroVoie,
                  typeVoie,
                  libelleVoie,
                  codePostal,
                  ville,
                  telephone,
                  categorie,
                )
              }
            >
              SUIVANT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
