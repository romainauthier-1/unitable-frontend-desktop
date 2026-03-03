import styles from "../styles/Home.module.css";
import Link from "next/link";
import BusinessForm from "./BusinessForm";
import Services from "./Services";
import { Button } from "./ui/button";

function Home() {
  return (
    <div>
      <main className="flex flex-col items-center justify-center min-h-screen py-16 px-0">
        <Button variant="outline" className="mb-8">
          <Link
            href="/businessForm"
            className="text-primary font-medium text-xl font-sans"
          >
            Aller sur le formulaire d'enregistrement du restaurant
          </Link>
        </Button>
        <Button variant="outline" className="mb-8">
          <Link
            href="/services"
            className="text-primary font-medium text-xl font-sans"
          >
            Aller sur la pages de création des services
          </Link>
        </Button>
      </main>
    </div>
  );
}

export default Home;
