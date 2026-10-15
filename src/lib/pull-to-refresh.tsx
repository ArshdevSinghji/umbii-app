import { errorToast } from "@/components/ui/app-toaster";
import { isUnauthorizedError, reportRequestError } from "@/lib/http-client";
import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import {
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
} from "react-native";

// Pull-to-refresh for a tab. The data is fetched by components deep inside
// the tab (with their own params, e.g. Home's selected day), so each one
// registers how to reload itself with `useRefresh`; pulling runs them all.
//
//   <RefreshProvider>
//     <RefreshableScrollView>…components calling useRefresh…</RefreshableScrollView>
//   </RefreshProvider>

type Refresher = () => Promise<unknown>;

interface IRefreshContext {
  register: (refresher: RefObject<Refresher>) => () => void;
  refreshAll: () => Promise<void>;
  isRefreshing: boolean;
}

const RefreshContext = createContext<IRefreshContext | null>(null);

export function RefreshProvider({ children }: { children: ReactNode }) {
  const refreshers = useRef(new Set<RefObject<Refresher>>());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const register = useCallback((refresher: RefObject<Refresher>) => {
    refreshers.current.add(refresher);
    return () => {
      refreshers.current.delete(refresher);
    };
  }, []);

  // All at once; one failure doesn't stop the rest. Data already on screen
  // stays (and updates in place), so a failure is only a toast.
  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    const results = await Promise.allSettled(
      [...refreshers.current].map((refresher) => refresher.current()),
    );
    setIsRefreshing(false);

    const failure = results.find(
      (result): result is PromiseRejectedResult =>
        result.status === "rejected" && !isUnauthorizedError(result.reason),
    );
    if (failure) {
      reportRequestError("Refresh failed:", failure.reason);
      errorToast("Couldn't refresh. Pull to try again.");
    }
  }, []);

  const value = useMemo(
    () => ({ register, refreshAll, isRefreshing }),
    [register, refreshAll, isRefreshing],
  );

  return (
    <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
  );
}

// Registers how this component reloads its data on pull-to-refresh. The
// latest `refresh` is used, so it can read current state (e.g. a picked day).
// It should reject on failure (don't swallow errors) so the toast can show.
export function useRefresh(refresh: Refresher) {
  const context = useContext(RefreshContext);
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  });

  useEffect(() => context?.register(refreshRef), [context]);
}

// Within this of the top counts as "at the top" (iOS bounce goes negative).
const TOP_THRESHOLD = 1;

// A ScrollView whose pull-down runs the provider's refreshers, with the
// spinner in the app's colours.
//
// Two-step, so scrolling up to the top can't refresh by accident: a drag that
// starts below the top never refreshes, even when it reaches the top. To
// refresh, lift your finger and pull again from the top. (Android disables
// the control for that drag; iOS can't, so the refresh is ignored instead.)
export function RefreshableScrollView({
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollEnd,
  ...props
}: ScrollViewProps) {
  const context = useContext(RefreshContext);
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  // Starts at the top, so the first pull works.
  const [canRefresh, setCanRefresh] = useState(true);
  const canRefreshRef = useRef(true);
  const setRefreshable = (value: boolean) => {
    canRefreshRef.current = value;
    setCanRefresh(value);
  };

  // A drag that starts away from the top is a scroll, not a pull.
  const handleScrollBeginDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (event.nativeEvent.contentOffset.y > TOP_THRESHOLD) {
      setRefreshable(false);
    }
    onScrollBeginDrag?.(event);
  };

  // Settled at the top (finger lifted, or a fling ran out there): the next
  // pull may refresh.
  const enableIfAtTop = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y <= TOP_THRESHOLD) {
      setRefreshable(true);
    }
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    enableIfAtTop(event);
    onScrollEndDrag?.(event);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    enableIfAtTop(event);
    onMomentumScrollEnd?.(event);
  };

  const handleRefresh = () => {
    // iOS: the control can't be disabled mid-drag, so drop the refresh.
    if (!canRefreshRef.current) return;
    context?.refreshAll();
  };

  return (
    <ScrollView
      {...props}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      refreshControl={
        context ? (
          <RefreshControl
            refreshing={context.isRefreshing}
            onRefresh={handleRefresh}
            // Android only: off for a drag that started below the top.
            enabled={Platform.OS !== "android" || canRefresh}
            // Android: spinner colour and its disc; iOS: spinner colour.
            colors={[theme.foreground]}
            progressBackgroundColor={theme.card}
            tintColor={theme.foreground}
          />
        ) : undefined
      }
    />
  );
}
