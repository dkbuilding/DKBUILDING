import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-dk-gray-800 bg-dk-black/50 px-3 py-2 text-sm text-white placeholder:text-dk-gray-500 focus:border-dk-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-dk-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dk-black disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };


