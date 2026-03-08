import CreateTeams from "../components/CreateTeams";

function TeamsPage() {
  return <CreateTeams />;
}

export default TeamsPage;

export async function getStaticProps() {
  return {
    props: {
      title: "Équipes",
      description:
        "Créez votre structure: équipes, et les rôles qu'elles comportent.",
    },
  };
}
