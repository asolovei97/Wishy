import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../_lib";
import Link from "next/link";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-500/90",
        secondary: "bg-accent-500 text-white hover:bg-accent-500/90",
        outline:
          "border border-primary-200 bg-white hover:bg-primary-200/50 hover:text-primary-200",
        ghost: "hover:bg-primary-200/50 text-stone-800",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-4 py-2",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
}

export const Button = ({
  variant,
  size,
  className,
  children,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {icon ? <span>icon</span> : null}
      {children}
    </button>
  );
};

interface LinkProps
  extends React.ComponentProps<"a">, VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  isLink?: boolean;
}

export const ButtonLink = ({
  variant,
  size,
  className,
  children,
  icon,
  href = "#",
  ...props
}: LinkProps) => {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {icon ? <span>icon</span> : null}
      {children}
    </Link>
  );
};
