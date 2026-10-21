import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Toaster, toast } from "sonner-native";

// Snackbar-style toasts, for errors only — success shows in the UI itself (a
// sheet closes, an item appears). Show one with `errorToast("…")`.
// The same frosted grey card in light and dark mode: a soft diagonal
// gradient with a hairline light outline.
const PALETTE = {
  // Solid fallback under the gradient, and the "!" cut-out colour.
  background: "#3A3A3E",
  text: "#FFFFFF",
  muted: "rgba(255, 255, 255, 0.65)",
  border: "rgba(255, 255, 255, 0.16)",
  gradient: ["#4C4C51", "#3A3A3E", "#2F2F32"] as const,
};
const ICON_SIZE = 22;

type ToastAction = { label: string; onPress: () => void };

interface ErrorToastProps {
  id: string;
  message: string;
  description?: string;
  action?: ToastAction;
}

// One row: icon, message, then the action as plain text on the right.
// (sonner-native's built-in action sits on its own row under the title, so
// this is rendered as a custom toast; it keeps the library's slide/swipe.)
function ErrorToast({ id, message, description, action }: ErrorToastProps) {
  const palette = PALETTE;

  return (
    <View
      style={[
        styles.toast,
        { backgroundColor: palette.background, borderColor: palette.border },
      ]}
    >
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
      {/* Filled circle in the text colour, "!" cut out in the background's. */}
      <View style={[styles.circle, { backgroundColor: palette.text }]}>
        <Text style={[styles.glyph, { color: palette.background }]}>!</Text>
      </View>

      <View style={styles.textColumn}>
        <Text style={[styles.title, { color: palette.text }]}>{message}</Text>
        {description ? (
          <Text style={[styles.description, { color: palette.muted }]}>
            {description}
          </Text>
        ) : null}
      </View>

      {action ? (
        <Pressable
          hitSlop={12}
          onPress={() => {
            action.onPress();
            toast.dismiss(id);
          }}
        >
          <Text style={[styles.action, { color: palette.muted }]}>
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
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  // Rounded itself rather than clipping the card: overflow "hidden" would
  // also clip the card's shadow on iOS.
  gradient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 15,
  },
  textColumn: { flex: 1, gap: 2 },
  title: { fontFamily: "Caudex-Regular", fontSize: 15 },
  description: { fontFamily: "Caudex-Regular", fontSize: 13 },
  action: { fontFamily: "Caudex-Regular", fontSize: 15 },
  circle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  glyph: { fontSize: 14, fontWeight: "800", lineHeight: 16 },
});
