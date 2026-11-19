import { Pressable, StyleSheet, Text, View } from "react-native";
import { Toaster, toast } from "sonner-native";

// Snackbar-style toasts, for errors only — success shows in the UI itself (a
// sheet closes, an item appears). Show one with `errorToast("…")`.
// Kept minimal, like the system's own: a flat dark card with the text and,
// if there is one, an action. The same in light and dark mode.
const PALETTE = {
  background: "#2B2B2F",
  text: "#FFFFFF",
  muted: "rgba(255, 255, 255, 0.6)",
};

type ToastAction = { label: string; onPress: () => void };

interface ErrorToastProps {
  id: string;
  message: string;
  description?: string;
  action?: ToastAction;
}

// One block of text (the description, dimmer, runs on after the message),
// then the action as plain text on the right. (sonner-native's built-in
// action sits on its own row under the title, so this is rendered as a
// custom toast; it keeps the library's slide/swipe.)
function ErrorToast({ id, message, description, action }: ErrorToastProps) {
  return (
    <View style={[styles.toast, { backgroundColor: PALETTE.background }]}>
      <Text style={[styles.text, { color: PALETTE.text }]}>
        {message}
        {description ? (
          <Text style={{ color: PALETTE.muted }}> {description}</Text>
        ) : null}
      </Text>

      {action ? (
        <Pressable
          hitSlop={12}
          onPress={() => {
            action.onPress();
            toast.dismiss(id);
          }}
        >
          <Text style={[styles.action, { color: PALETTE.text }]}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

let toastCount = 0;

// Pass an `id` to show a toast once even when it's raised several times
// (a toast with the same id replaces the shown one).
export function errorToast(
  message: string,
  {
    id = `error-${++toastCount}`,
    ...options
  }: { id?: string; description?: string; action?: ToastAction } = {},
) {
  return toast.custom(<ErrorToast id={id} message={message} {...options} />, {
    id,
  });
}

export function AppToaster() {
  return <Toaster position="top-center" />;
}

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  text: { flex: 1, fontFamily: "Caudex-Regular", fontSize: 15, lineHeight: 20 },
  action: { fontFamily: "Caudex-Bold", fontSize: 15 },
});
