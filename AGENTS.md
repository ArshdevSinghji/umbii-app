# Umbii — agent guide

Read this first; it replaces a codebase survey. Keep it current (see "Maintaining this file").

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.
Stack: Expo SDK 56, React Native 0.85, React 19.2 (React Compiler on), expo-router (typed routes), TypeScript strict.

## What the app is

AI calorie / nutrition tracker (Android-first; package `com.umbii`). Users sign in with Google, onboard (body stats, goal, pace, food prefs) → server generates a nutrition target. They log meals by typing what they ate; the server AI turns the text into items with macros (`food-logs/generate`), the user confirms (`food-logs` POST). Also: saved recipes (re-log a meal), weight journal + BMI, period breakdown (day/week/month/year) with a health score.

Backend is a separate repo (not here). Base URL `EXPO_PUBLIC_API_URL` (dev: `http://localhost:8080`, tunnelled to devices by `scripts/adb-reverse.sh`). Responses are `{ message, data }` (`ApiResponse<T>`).

## Commands

- `npm run android` — dev build on device (runs adb reverse first). User rebuilds native themselves; just say when a native rebuild is needed.
- `npm start` — Metro only. `npm run lint` — ESLint. No test suite.
- `postinstall` applies `patches/` (react-native-calendars, react-native-ruler-picker) via patch-package.
- `/android` and `/ios` are generated (gitignored); configure native via `app.json` plugins.

## Layout

```
src/app/            routes only — thin wrappers that render a component from src/components
  _layout.tsx       providers, fonts, splash, theme load, auth redirect (single effect)
  (sign-in)/        Google sign-in
  (tabs)/           home | breakdown ("Stats") | log-food | stats ("Goals") | profile
                    custom FloatingTabBar; useOnboardingGate sends profile-less users to /onboarding
  onboarding/ plan/ health-details/ recipes/ settings/   stack screens
src/components/<screen>/<part>/index.tsx   one folder per component; loading.tsx = skeleton,
                    hooks/ = screen-specific hooks, *.schema.ts (zod), *.utils.ts, *.types.ts
src/components/ui/  react-native-reusables (shadcn for RN, components.json) + app primitives
                    (gradient-card, confirm-dialog, app-toaster, error-state, skeleton, …)
src/features/<domain>/   Redux data layer (see below): user, food-logs, nutrition-target,
                    recipes, weight-journals, preferences
src/lib/            http-client, token (SecureStore), use-auth, event-bus, pull-to-refresh,
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

Endpoints (all under `/users/{userId}` unless noted): `GET/PUT/DELETE /`, `POST /` (onboarding), `PATCH /profile`; `food-logs` GET/POST, `food-logs/generate` POST, `food-logs/{id}` GET; `nutrition-target` GET/POST, `/generate` POST, `/report` GET; `recipes` GET/POST, `recipes/{id}` GET/PUT/DELETE; `weight-journals` GET/POST, `/{id}` GET/PUT/DELETE. No auth: `POST /sign-in`, `POST /auth/refresh`, `POST /auth/sign-out`.

## Auth & session

- Google Sign-In → `POST /sign-in` → `saveSession` stores access token (15 min), refresh token (30 days, **single use**) and userId in SecureStore → `eventBus.emit("auth:signin")`.
- `http-client` on 401 `"Token expired"`: one shared in-flight refresh (concurrent refreshes = theft → server ends session), retry once. Unrecoverable 401 → `clearSession`, emit `auth:unauthorized` with reason (`session-ended` | `expired`), throw `UnauthorizedError`. Root layout shows a toast and redirects.
- Treat `UnauthorizedError` as expected: use `reportRequestError` / `isUnauthorizedError` (no error UI for 401s).
- Nothing in Redux is persisted. Session → SecureStore; theme preference → AsyncStorage; everything else refetched. The user profile is loaded by `useOnboardingGate` on launch.
- `firebaseConfig.js` exists but nothing in `src` uses it.

## UI conventions

- NativeWind v4 (Tailwind 3) classes; `cn()` for merging. Colors are CSS vars in `src/global.css`; anything coloured in JS (charts, icons, nav) uses `THEME[colorScheme]` from `lib/theme.ts`, which must mirror global.css.
- Font: Caudex everywhere (`font-sans`, `font-sans-bold`, …). Use `Text` from `@/components/ui/text`.
- Icons: phosphor-react-native imported per icon (`phosphor-react-native/src/icons/House`), never the package root.
- Tab screens: `SafeAreaView` + `RefreshProvider` + `RefreshableScrollView`, bottom padding `FLOATING_TAB_BAR_CLEARANCE`. Components register reloads with `useRefresh(fn)`; first load uses `useInitialLoad` (skeleton → error card with retry).
- Lists newest first (sort by `createdAt`, then `id`). Dates are local `yyyy-MM-dd` keys (`utils/date.ts`).
- Toasts: sonner-native via `components/ui/app-toaster` (`errorToast`, …). Confirmations: `ConfirmDialog`. Sheets/overlays mount into `PortalHost`.
- Other libs in use: flash-list, reanimated 4, gesture-handler, keyboard-controller (use it, not KeyboardAvoidingView), expo-image, react-native-calendars, ruler-picker, d3-shape (charts), @shopify/react-native-skia (UI-thread drawing), expo-speech-recognition (pin to the SDK's major, e.g. ^56 — `expo install` picks the wrong one), zod.
- Prefer an established library over hand-rolled UI for anything non-trivial (charts, pickers, gestures); native deps are fine.

## Code style

- Comments explain *why*, in plain short sentences, above the code (see http-client.ts, token.ts). Match that density.
- Double quotes in components/features; some lib files use single quotes — match the file.
- Default-export components; named exports for hooks/utils.

## Status / known gaps

- Voice logging (Log Food input): on-device speech-to-text via expo-speech-recognition (`hooks/use-voice-input.ts`); the transcript goes through the normal text flow (`food-logs/generate`). No audio is uploaded. Waveform = Skia paths driven by a Reanimated frame callback (`food-input/waveform`). Language is the library default `en-US`; there's no auto-detection (one language per session).
- Localization is planned but not started. When it lands, pass the app locale as `lang` in `use-voice-input.ts` `start()`.
- `.mock-server/` is empty.

## Maintaining this file

Update this file in the same change when you add a route/screen, feature domain, endpoint, convention, or library, or discover a non-obvious gotcha. Keep it terse: facts an agent can't get in one glance at the code. Don't list every file or restate code. Remove anything that becomes false.
