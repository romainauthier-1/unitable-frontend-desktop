import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Connection() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4">
      <Link href="/signup">
        <Button>Inscription</Button>
      </Link>

      <Link href="/login">
        <Button>Connexion</Button>
      </Link>
    </div>
  );
}
