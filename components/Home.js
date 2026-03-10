import styles from "../styles/Home.module.css";
import Link from "next/link";
import BusinessForm from "./BusinessForm";
import Services from "./Services";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

function Home() {
  const token = useSelector((state) => state.users.token);
  const router = useRouter();

  if (!token) {
    router.push("/login");
  } else {
    router.push("/dashboard");
  }

  return <h1>Bienvenue sur UniTable</h1>;
}

export default Home;
