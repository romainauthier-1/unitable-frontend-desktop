// Transformer l'heure (format 12:30) en 'minutes depuis minuit' pour l'envoyer à la BDD
const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

// Transformer les 'minutes depuis minuit' de la BDD en heure lisible
const convertMinutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

module.exports = { convertTimeToMinutes, convertMinutesToTime };
