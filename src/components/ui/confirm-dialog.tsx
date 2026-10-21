import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  // Red confirm button, for things that can't be undone.
  destructive?: boolean;
}

// "Are you sure?" before an action with consequences, built on the
// reusables AlertDialog, with the app's pill buttons. Cancel closes it;
// confirm closes it and runs `onConfirm`.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = false,
}: IProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-sans-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onPress={onConfirm}
            className={cn(
              "h-12 rounded-full",
              destructive && buttonVariants({ variant: "destructive" }),
              destructive && "h-12 rounded-full",
            )}
            textClassName={destructive ? "text-white" : undefined}
          >
            <Text>{confirmLabel}</Text>
          </AlertDialogAction>
          <AlertDialogCancel className="h-12 rounded-full">
            <Text>Cancel</Text>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
