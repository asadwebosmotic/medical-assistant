import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-medical-primary text-medical-primary-foreground hover:bg-button-primary-hover shadow-lg hover:shadow-xl transform hover:scale-105",
        destructive:
          "bg-medical-danger text-text-primary hover:bg-medical-danger/90",
        outline:
          "border border-input bg-transparent hover:bg-card hover:text-text-primary",
        secondary:
          "bg-button-secondary text-text-primary hover:bg-button-secondary-hover shadow-md hover:shadow-lg",
        ghost: "hover:bg-card hover:text-text-primary",
        link: "text-medical-primary underline-offset-4 hover:underline",
        medical: "bg-medical-primary text-medical-primary-foreground hover:bg-button-primary-hover shadow-lg hover:shadow-xl glow-effect",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
