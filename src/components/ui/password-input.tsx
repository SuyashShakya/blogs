import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative w-full max-w-sm">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
      {showPassword ? (
        <EyeOff
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
          onClick={() => setShowPassword(false)}
        />
      ) : (
        <Eye
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
          onClick={() => setShowPassword(true)}
        />
      )}
    </div>
  );
});
PasswordInput.displayName = "Input";

export { PasswordInput };
