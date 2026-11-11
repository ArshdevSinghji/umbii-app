# Umbii — agent guide

Read this first; it replaces a codebase survey. Keep it current (see "Maintaining this file").

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.
Stack: Expo SDK 56, React Native 0.85, React 19.2 (React Compiler on), expo-router (typed routes), TypeScript strict.

## What the app is

AI calorie / nutrition tracker (Android-first; package `com.umbii`). Users sign in with Google, onboard (body stats, goal, pace, week, health flags) → server generates a nutrition target. They log meals by typing what they ate; the server AI turns the text into items with macros (`food-logs/generate`), the user confirms (`food-logs` POST). Also: saved recipes (re-log a meal), weight journal + BMI, period breakdown (day/week/month/year) with a health score.

Backend is a separate repo (not here). Base URL `EXPO_PUBLIC_API_URL` (dev: `http://localhost:8080`, tunnelled to devices by `scripts/adb-reverse.sh`). Responses are `{ message, data }` (`ApiResponse<T>`). Every `http` request sends `X-Timezone` (IANA zone, `lib/timezone.ts`, read per request): the server uses it for the user's calendar day, default "today" and reminder timing, and 400s an invalid zone, so omit rather than guess. `createdAt`/`updatedAt` are `yyyy-MM-dd` days; food logs also have `loggedAt` (ISO UTC).

## Commands

- `npm run android` — dev build on device (runs adb reverse first). User rebuilds native themselves; just say when a native rebuild is needed.
- `npm start` — Metro only. `npm run lint` — ESLint. No test suite.
- `postinstall` applies `patches/` (react-native-calendars, react-native-ruler-picker) via patch-package.
- `/android` and `/ios` are generated (gitignored); configure native via `app.json` plugins. `expo run:android` doesn't re-run prebuild when `android/` exists: after app.json changes run `npx expo prebuild -p android --clean`.
- Standalone APK: `npx expo run:android --variant release` (from the root; builds + installs). Release bundles load `.env.production.local` first (live Railway API URL), dev keeps `.env.local` (localhost). Signed with the debug keystore, so Google Sign-In's registered SHA-1 still matches. Builds are arm64-v8a only with R8 minify + resource shrinking (expo-build-properties), so no x86 emulators.
- Android-only: iOS was considered and dropped (no Mac / Apple Developer account).

## Layout

```
src/app/            routes only — thin wrappers that render a component from src/components
  _layout.tsx       providers, fonts, splash, theme load, auth redirect (single effect)
  (sign-in)/        Google sign-in
  (tabs)/           home | breakdown ("Stats") | log-food | stats ("Goals") | profile
                    custom FloatingTabBar; useOnboardingGate sends profile-less users to /onboarding
  onboarding/ plan/ health-details/ recipes/ notifications/   stack screens (no settings screen: app prefs live on Profile)
src/components/<screen>/<part>/index.tsx   one folder per component; loading.tsx = skeleton,
                    hooks/ = screen-specific hooks, *.schema.ts (zod), *.utils.ts, *.types.ts
src/components/ui/  react-native-reusables (shadcn for RN, components.json) + app primitives
                    (gradient-card, confirm-dialog, app-toaster, error-state, skeleton, …)
src/features/<domain>/   Redux data layer (see below): user, food-logs, nutrition-target,
                    recipes, weight-journals, preferences (theme), notifications (push device + reminder prefs)
src/lib/            http-client, token (SecureStore), use-auth, event-bus, pull-to-refresh,
                    push-notifications (permission/token/channel), use-push-notifications,
                    use-initial-load, theme (THEME mirrors global.css), floating-tab-bar, utils (cn)
src/utils/          pure helpers: date keys, BMI, health score, period ranges, initials
src/store/          store.ts (combineReducers, slice keys `<name>Slice`), hooks.ts (useAppDispatch/Selector)
```
Import alias `@/*` → `src/*`. SVGs import as components (react-native-svg-transformer).

## Data layer pattern (follow exactly when adding an endpoint)

`src/features/<domain>/<op-name>/` holds three files:
- `<op>.types.ts` — `<Op>Request` (always includes `userId`) / response types
- `<op>.service.ts` — `http.get|post|put|patch|delete<ApiResponse<T>>(\`/users/${userId}/…\`)`
- `<op>.action.ts` — `createAsyncThunk(<Domain>ActionTypes.X, …)`, returns `response.data`, rejects with `thunkAPI.rejectWithValue(toRequestError(error))` (errors must be serializable)

Domain level: `<domain>.types.ts` (ActionTypes enum, entity `I<Entity>`, `<Domain>State`), `<domain>.slice.ts` (extraReducers per thunk), `<domain>.hooks.ts` (`use<Domain>ActionsHook()` returns state + async fns that `dispatch(...).unwrap()`), optional `.utils.ts`.

**One thunk per API route.** Add a second action for the same route only when its result would overwrite data already mounted elsewhere (tabs stay mounted in RN). Existing accepted splits: food-logs → `listFoodLogs` (Home's day) / `listPeriodFoodLogs` (Breakdown) / `listRecentFoodLogs` (Log Food, last 7 days); nutrition-target and weight-journals similar (latest vs chart/period). Ask the user if unsure.

Endpoints (all under `/users/{userId}` unless noted): `GET/PUT/DELETE /`, `POST /` (onboarding), `PATCH /profile` (any onboarding answer except allergies; regenerates the target); `food-logs` GET/POST, `food-logs/generate` POST, `food-logs/{id}` GET; `nutrition-target` GET/POST (GET 404 "Nutrition target not set." = none yet; the action resolves `null`), `/report` GET (no `/generate`: removed server-side, targets regenerate on their own); `recipes` GET/POST, `recipes/{id}` GET/PUT/DELETE; `weight-journals` GET/POST, `/{id}` GET/PUT/DELETE (a weigh-in, or correcting the latest, regenerates a stale generated target: weight 1 kg+ off, goal reached; responses don't include it, so the weight hook refetches the current target); `push-devices` POST (upsert), `/{id}` DELETE; `notification-preferences` GET/PATCH (partial). No auth: `POST /sign-in`, `POST /auth/refresh`, `POST /auth/sign-out`.

## Auth & session

- Google Sign-In → `POST /sign-in` → `saveSession` stores access token (15 min), refresh token (30 days, **single use**) and userId in SecureStore → `eventBus.emit("auth:signin")`.
- `http-client` on 401 `"Token expired"`: one shared in-flight refresh (concurrent refreshes = theft → server ends session), retry once. Unrecoverable 401 (incl. any 401 from `/auth/refresh`) → `clearSession` unconditionally, emit `auth:unauthorized` with reason (`session-ended` | `expired`), throw `UnauthorizedError`. `useAuth` then dispatches `clearUser` (same as sign-out) and the root layout shows a toast and redirects to sign-in.
- Treat `UnauthorizedError` as expected: use `reportRequestError` / `isUnauthorizedError` (no error UI for 401s).
- Nothing in Redux is persisted. Session → SecureStore; theme preference → AsyncStorage; everything else refetched. The user profile is loaded by `useOnboardingGate` on launch.
- `firebaseConfig.js` exists but nothing in `src` uses it.

## Push notifications

- expo-notifications, single Android channel `default` (backend sends no channelId). Foreground banners via `showNotificationsInForeground()` in the root layout.
- `usePushNotifications()` in the tabs layout: once the user has a profile (so the OS prompt comes after onboarding, asked automatically only once), registers on every launch/sign-in and on token change; handles taps (`data.route`, incl. cold start) and `data.type === "signed_out_elsewhere"` → `endSessionLocally`. The refresh 401 stays the reliable sign-out signal.
- Push on/off is per device (AsyncStorage `push_notifications`); off = DELETE push device. Sign-out needs no DELETE (server drops it). Reminder prefs are per account (server).
- `data.route` must be an expo-router path (e.g. `/home`, `/plan`). The server's `signed_out_elsewhere` route `/sign-in` isn't one; it's handled by `type`.
- Android fires the push-token event on every token fetch, not just on change. Never re-fetch/re-register from `addPushTokenListener` without checking `isKnownDeviceToken` — it loops (spams POST /push-devices and floods "Fetch request has been canceled" warnings).
- Needs a physical device and an EAS project id (`extra.eas.projectId`); emulators get no token.

## UI conventions

- NativeWind v4 (Tailwind 3) classes; `cn()` for merging. Colors are CSS vars in `src/global.css`; anything coloured in JS (charts, icons, nav) uses `THEME[colorScheme]` from `lib/theme.ts`, which must mirror global.css.
- Font: Caudex everywhere (`font-sans`, `font-sans-bold`, …). Use `Text` from `@/components/ui/text`.
- Icons: phosphor-react-native imported per icon (`phosphor-react-native/src/icons/House`), never the package root.
- Tab screens: `SafeAreaView` + `RefreshProvider` + `RefreshableScrollView`, bottom padding `FLOATING_TAB_BAR_CLEARANCE`. Components register reloads with `useRefresh(fn)`; first load uses `useInitialLoad` (skeleton → error card with retry).
- Lists newest first (sort by `createdAt`, then `id`). Dates are local `yyyy-MM-dd` keys (`utils/date.ts`).
- Toasts: sonner-native via `components/ui/app-toaster` (`errorToast`, …). Confirmations: `ConfirmDialog`. Sheets/overlays mount into `PortalHost`.
- Other libs in use: flash-list, reanimated 4, gesture-handler, keyboard-controller (use it, not KeyboardAvoidingView), expo-image, react-native-calendars, ruler-picker, d3-shape (charts), @shopify/react-native-skia (UI-thread drawing), expo-localization (timezone fallback; localization later), expo-speech-recognition (pin to the SDK's major, e.g. ^56 — `expo install` picks the wrong one), zod.
- rn-primitives treat `value={undefined}` as uncontrolled, so a controlled Accordion (etc.) can't be "closed" by passing undefined — it falls back to stale internal state (needs two taps). Leave it uncontrolled and just listen with `onValueChange`.
- Launch: native splash (expo-splash-screen in app.json: "umbii" wordmark PNGs, light/dark by system theme) → `components/launch-screen` draws an identical copy, hides the native one once its image displays (`preventAutoHideAsync` at module scope in the root layout), then zooms/fades out. Keep its colours, images and `WORDMARK_WIDTH` in sync with app.json. The wordmark must fit Android 12's 192dp icon circle. `app-splash` is the separate in-app spinner shown while the profile loads.
- Editing the plan: each Plan "Your details" row opens its own bottom sheet (`my-plan/detail-sheet`, one `DetailField` each): its picker prefilled from the profile, Save → PATCH /profile (weight → today's weigh-in). Changing goal also asks target + pace; 0 → some workouts also asks training type + session. Pickers live in `components/profile-fields/` and are shared with the onboarding steps. No redo-onboarding or recalculate button. Onboarding doesn't ask diet or allergies (nullable server-side, kept for future meal suggestions): POST omits them, `dietType`/`allergies` are null until set; diet can be set on Plan ("Not set"); allergies can't be PATCHed, so Plan shows them read-only only for older accounts that have some. Health-flag options carry subtitles describing what the server calculator does per flag (`health-flags-picker`); keep them in sync with the backend.
- Target weight must be ≥ `TARGET_MARGIN_KG` (0.5) past the latest weigh-in in the goal's direction (server rule: closer = reached → maintenance). `getTargetWeightRange(weight, goalType)` builds the ruler on that side only; `TargetMarginNote` explains it under every target ruler.
- Stats (breakdown): content is a `@gorhom/bottom-sheet` over the `ExpandableCalendar` (`breakdown/content-sheet`). Dragging anywhere on it moves the sheet; its `BottomSheetScrollView` only scrolls once it's fully up. It rests under the month grid (calendar's measured top + header + `CALENDAR_WEEK_HEIGHT` (46, the library's fixed row height) × weeks) and expands to a fixed 75% of the screen. The calendar stays a full month (no fold to week, its pan/knob disabled): folding re-lays out every month page, too heavy. `BottomSheet` needs `enableDynamicSizing={false}` for fixed snap points. Install it with `--force`: npm otherwise tries to bump reanimated past RN 0.85.
- Prefer an established library over hand-rolled UI for anything non-trivial (charts, pickers, gestures); native deps are fine.

## Code style

- Comments explain *why*, in plain short sentences, above the code (see http-client.ts, token.ts). Match that density.
- Double quotes in components/features; some lib files use single quotes — match the file.
- Default-export components; named exports for hooks/utils.

## Status / known gaps

- Voice logging (Log Food input): on-device speech-to-text via expo-speech-recognition (`hooks/use-voice-input.ts`); the transcript goes through the normal text flow (`food-logs/generate`). Recording with text already typed appends the words after it: while recording the composer is a pill with only the recording bar (the text is kept, hidden), then shows the combined text. No audio is uploaded. Waveform = Skia paths driven by a Reanimated frame callback (`food-input/waveform`). Language is the library default `en-US`; there's no auto-detection (one language per session).
- Generating a meal (Log Food): the field clears and the message floats above the composer (`food-input/pending-meal`) and a pulsing status chip ("Reading your meal…") sits in the input in place of the placeholder over a dimmed, tap-blocking backdrop (`food-input/generation-status`, stages in `hooks/use-meal-generation.ts`) instead of a spinner; on failure the text returns.
- Localization is planned but not started. When it lands, pass the app locale as `lang` in `use-voice-input.ts` `start()`.
- `.mock-server/` is empty.

## Maintaining this file

Update this file in the same change when you add a route/screen, feature domain, endpoint, convention, or library, or discover a non-obvious gotcha. Keep it terse: facts an agent can't get in one glance at the code. Don't list every file or restate code. Remove anything that becomes false.
