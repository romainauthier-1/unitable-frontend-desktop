import styles from "../styles/Home.module.css";
import Link from "next/Link";
import BusinessForm from "./BusinessForm";

function Home() {
  return (
    <div>
      <main className={styles.main}>
        <Link href="/businessForm">
          Aller sur le formulaire d'enregistrement du restaurant
        </Link>
      </main>
    </div>
  );
}

export default Home;
