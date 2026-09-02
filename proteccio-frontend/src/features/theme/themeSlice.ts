import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  mode: ThemeType;
  isInitialized: boolean;
}

const isBrowser = typeof window !== 'undefined';
const DEFAULT_THEME: ThemeType = 'light';

const getPreloadedTheme = (): ThemeType =>
  !isBrowser ? DEFAULT_THEME : (window as any).__THEME_STATE__ || getSystemTheme();

const getSystemTheme = (): ThemeType =>
  !isBrowser
    ? 'light'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

const getThemeModeFromLocalStorage = (): ThemeType => {
  if (!isBrowser) return DEFAULT_THEME;
  try {
    return (localStorage.getItem('theme') as ThemeType) || getSystemTheme();
  } catch {
    return DEFAULT_THEME;
  }
};

const updateDocumentTheme = (themeMode: ThemeType): void => {
  if (!isBrowser) return;

  const root = document.documentElement;
  const oppositeTheme = themeMode === 'dark' ? 'light' : 'dark';
  const themeColor = themeMode === 'dark' ? '#08111F' : '#F4F7F6';

  [root, document.body].forEach(element => {
    element.classList.remove(oppositeTheme);
    element.classList.add(themeMode);
  });

  root.style.colorScheme = themeMode;

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor);

  (window as any).__THEME_STATE__ = themeMode;
};

const saveThemeModeToLocalStorage = (themeMode: ThemeType): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('theme', themeMode);
    updateDocumentTheme(themeMode);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
};

const initialState: ThemeState = {
  mode: getPreloadedTheme(),
  isInitialized: false,
};

const themeSlice = createSlice({
  name: 'themeReducer',
  initialState,
  reducers: {
    toggleTheme: (state: ThemeState) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      saveThemeModeToLocalStorage(state.mode);
    },
    setTheme: (state: ThemeState, action: PayloadAction<ThemeType>) => {
      state.mode = action.payload;
      saveThemeModeToLocalStorage(state.mode);
    },
    initializeTheme: (state: ThemeState) => {
      if (!state.isInitialized) {
        state.mode = getThemeModeFromLocalStorage();
        state.isInitialized = true;
        updateDocumentTheme(state.mode);
      }
    },
  },
});

export const { toggleTheme, setTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
