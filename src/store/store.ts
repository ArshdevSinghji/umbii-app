import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { userReducer } from '@/features/user/user.slice';
import { foodLogsReducer } from '@/features/food-logs/food-logs.slice';
import { nutritionTargetReducer } from '@/features/nutrition-target/nutrition-target.slice';
import { recipesReducer } from '@/features/recipes/recipes.slice';
import { weightJournalsReducer } from '@/features/weight-journals/weight-journals.slice';
import { preferencesReducer } from '@/features/preferences/preferences.slice';

// Nothing here is persisted. The session (tokens, user id) is in SecureStore
// (lib/token.ts), the theme in AsyncStorage (preferences.storage.ts); server
// data is refetched.
const rootReducer = combineReducers({
  userSlice: userReducer,
  foodLogsSlice: foodLogsReducer,
  nutritionTargetSlice: nutritionTargetReducer,
  recipesSlice: recipesReducer,
  weightJournalsSlice: weightJournalsReducer,
  preferencesSlice: preferencesReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
