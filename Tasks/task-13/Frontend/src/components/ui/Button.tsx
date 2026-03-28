import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("btn-glow", className)} {...props} />
  )
);
Button.displayName = "Button";
export { Button };
