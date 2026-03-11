import {
  IconCancel,
  IconCircleCheck,
  IconAlertTriangle,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export function SectionCards() {
  // recuperer le nombre d'employee avec reducer employee
  const employee = useSelector((state) => state.employee.value);
  const zipCode = useSelector((state) => state.business.value[0]?.zipCode);
  const numberOfEmployees = employee.employees.length;
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [weatherCode, setWeatherCode] = useState(null);
  const [weatherLabel, setWeatherLabel] = useState("");
  const [precipitation, setPrecipitation] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [meteoLoading, setMeteoLoading] = useState(false);
  console.log("Nombre d'employés dans le store: ", numberOfEmployees);

  // recuperer le jour de la semaine avec date du jour
  const [currentDay, setCurrentDay] = useState(
    new Date().toLocaleDateString("fr-FR", { weekday: "long" }),
  );
  console.log("Jour de la semaine: ", currentDay);

  // recuperer services où dayOfWeek contient currentDay
  const services = useSelector((state) => state.services.value);
  // if services is not empty, filter services where dayOfWeek contains currentDay, else return empty array

  const servicesOfTheDay =
    services != undefined
      ? services.filter((service) => service.dayOfWeek.includes(currentDay))
      : [];
  console.log(servicesOfTheDay);
  //const servicesDisplay = servicesOfTheDay.map((service) => (
  //));

  let countEmployees = 0;
  servicesOfTheDay.forEach((service) => {
    for (const team of service.teams) {
      team.roles.forEach((role) => {
        countEmployees += Number(role.need);
        console.log(countEmployees);
      });
    }
  });
  const staffOk = numberOfEmployees >= countEmployees;
  console.log(
    "Le nombre d'employés est-il suffisant pour les services du jour ? ",
    staffOk,
  );

  const meteo = () => {
    if (!zipCode) {
      console.warn("Code postal non disponible");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    if (!apiKey) {
      console.warn(
        "Clé OpenWeather manquante: NEXT_PUBLIC_OPENWEATHERMAP_API_KEY",
      );
      return;
    }

    setMeteoLoading(true);
    console.log(process.env.OPENWEATHERMAP_API_KEY);
    fetch(
      `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},FR&appid=${apiKey}`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Données de localisation:", data);
        if (!data || !data.lat || !data.lon) {
          throw new Warning("Données de localisation invalides");
        }
        const { lat, lon } = data;
        console.log("COORDONNEES GPS", lat, lon);
        setLatitude(lat);
        setLongitude(lon);

        return fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`,
        );
      })
      .then((response) => response.json())
      .then((data) => {
        //console.log de l'appel api

        if (!data?.main) {
          console.log(
            "Données météo non disponibles pour les coordonnées fournies.",
          );
        } else {
          setTemperature(data.main.temp ?? null);
          setWeatherCode(data.weather?.[0]?.id ?? null);
          setWeatherIcon(data.weather?.[0]?.icon ?? null);
          setWeatherLabel(data.weather?.[0]?.description ?? "");
          setPrecipitation(data.rain?.["1h"] ?? 0);
          setWindSpeed(data.wind?.speed);
        }
      })
      .catch((error) => {
        console.error("Erreur météo :", error);
      })
      .finally(() => setMeteoLoading(false));
  };

  useEffect(() => {
    if (zipCode) {
      meteo();
    }
  }, [zipCode]);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>CA Actuel</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,250.00 €
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tendance ce mois-ci: <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground"></div>
        </CardFooter>
      </Card>
      <Card
        className="@container/card"
        style={{
          backgroundColor:
            numberOfEmployees >= countEmployees ? "green" : "red",
        }}
      >
        <CardHeader>
          <CardDescription>Employé.es en poste</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Réel: {numberOfEmployees}, Attendu: {countEmployees}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {staffOk ? <IconCircleCheck /> : <IconAlertTriangle />}
              {staffOk ? "OK" : "Attention"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Affiche en Rouge si Reel inferieur a Attendu, en vert si egal ou
            superieur? <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Nombre d'employé.es:</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfEmployees}
          </CardTitle>
          <CardAction></CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium"></div>
          <div className="text-muted-foreground"></div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            Météo sur le département {zipCode || "Pas de Code Postal"}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {temperature ? `${temperature}°C` : "N/A"}
          </CardTitle>
         
          <CardAction>
            {weatherCode && (
              <Badge variant="outline">Code: {weatherCode}</Badge>
            )}
            {weatherIcon && (
              <Image src={`http://openweathermap.org/img/wn/${weatherIcon}.png`} width={150} height={150} alt="Weather Icon" />
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {temperature ? "Données disponibles" : "Pas de données"}
          </div>
          {precipitation !== null && (
            <div className="text-muted-foreground">
              Pluie: {precipitation} mm
            </div>
          )}
          {windSpeed !== null && (
            <div className="text-muted-foreground">Vent: {windSpeed} km/h</div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
