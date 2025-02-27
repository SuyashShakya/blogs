import { Check, CircleAlert } from "lucide-react";
import { toast } from "sonner";

export const customtoast = ({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) => {
  return toast(message, {
    icon:
      type === "success" ? (
        <Check className="text-green-500" />
      ) : (
        <CircleAlert className="text-red-500" />
      ),
  });
};
