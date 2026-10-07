import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userReducer } from '@/features/user/user.slice';
import { foodLogsReducer } from '@/features/food-logs/food-logs.slice';
import { nutritionTargetReducer } from '@/features/nutrition-target/nutrition-target.slice';
import { recipesReducer } from '@/features/recipes/recipes.slice';
import { weightJournalsReducer } from '@/features/weight-journals/weight-journals.slice';
import { preferencesReducer } from '@/features/preferences/preferences.slice';

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['user'], 
}

const preferencesPersistConfig = {
  key: 'preferences',
  storage: AsyncStorage,
}

const rootReducer = combineReducers({
  userSlice: persistReducer(userPersistConfig, userReducer),
  foodLogsSlice: foodLogsReducer,
  nutritionTargetSlice: nutritionTargetReducer,
  recipesSlice: recipesReducer,
  weightJournalsSlice: weightJournalsReducer,
  preferencesSlice: persistReducer(preferencesPersistConfig, preferencesReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore internal redux-persist actions to prevent console warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 5. Create the persistor
export const persistor = persistStore(store);

// 6. Export TypeScript types derived from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
