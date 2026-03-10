// Transformer l'heure (format 12:30) en 'minutes depuis minuit' pour l'envoyer à la BDD
const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Transformer les 'minutes depuis minuit' de la BDD en heure lisible
const convertMinutesToTime = (minutes) => {
  if (minutes === undefined || minutes === null) return "00:00";

  const minutesNumber = Number(minutes);

  const hours = Math.floor(minutesNumber / 60);
  const mins = minutesNumber % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

module.exports = { convertTimeToMinutes, convertMinutesToTime };
