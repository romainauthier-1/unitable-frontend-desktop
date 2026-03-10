import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function ActionButton({
  label = "Action",
  action,
  variant = "outline",
  icon: Icon,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(action(router.pathname));
  };

  return (
    <Button variant={variant} onClick={handleClick} className="gap-2">
      {Icon && <Icon size={16} />}
      {label}
    </Button>
  );
}
