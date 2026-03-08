import { useSelector } from "react-redux";
import { User, Store, Info } from "lucide-react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import ActionButton from "@/components/ActionButton";
import { toggleInstructions } from "@/reducers/instructions";

export default function HeaderAdminSignUp() {
  const business = useSelector((state) => state.business.value);
  const user = useSelector((state) => state.user.value);

  return (
    <div className=" rounded-lg bg-white border border-accent shadow-lg flex flex-row w-full justify-evenly h-28 items-center p-6">
      <Toaster richColors position="top-right" />
      <div className=" text-accent-foreground flex flex-col items-center">
        <Store className="p-1" size={40} />
        {business[0]?.businessCommercialName || "Restaurant non enregistré"}
      </div>
      <div className=" text-accent-foreground flex flex-col items-center">
        <h1 className="text-5xl text-brand-dark">UniTable</h1>
      </div>
      <div className=" text-accent-foreground flex flex-col items-center">
        <User className="p-1" size={40} />
        {user?.name || "AUCUN UTILISATEUR CONNECTÉ"}
      </div>
      <ActionButton
        action={toggleInstructions}
        label="Infos"
        icon={Info}
        variant="outline"
      />
    </div>
  );
}
