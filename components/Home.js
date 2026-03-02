import styles from "../styles/Home.module.css";
import Link from "next/Link";
import CreationEntiteForm from "./CreationEntiteForm";

function Home() {
  return (
    <div>
      <main className={styles.main}>
        <Link href="/creationEntiteForm">
          Aller sur le formulaire de création d'entité
        </Link>
      </main>
    </div>
  );
}

export default Home;
