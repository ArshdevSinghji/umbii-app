import { Button, type ButtonProps } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { cn } from "@/lib/utils";

interface IProps extends Omit<ButtonProps, "children"> {
  label: string;
  // Shows a spinner in place of the label and blocks presses.
  isLoading?: boolean;
}

// Full-height, pill-shaped button for confirming / dismissing sheets and
// forms (Save, Close, …), so every footer action looks and behaves the same.
export function ActionButton({
  label,
  isLoading = false,
  disabled,
  className,
  ...props
}: IProps) {
  return (
    <Button
      className={cn("h-12 rounded-full", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      <Loading isLoading={isLoading} text={label} />
    </Button>
  );
}
