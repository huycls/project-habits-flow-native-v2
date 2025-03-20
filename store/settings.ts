import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Theme {
  background: string;
  text: string;
  secondaryText: string;
  card: string;
  border: string;
  primary: string;
  error: string;
  success: string;
}

export const lightTheme: Theme = {
  background: '#FFFEFF',
  text: '#1F2937',
  secondaryText: '#6B7280',
  card: 'rgba(157,206,255,0.3)',
  border: '#E5E7EB',
  primary: '#6366F1',
  error: '#EF4444',
  success: '#10B981',
};

export const darkTheme: Theme = {
  background: '#111827',
  text: '#F9FAFB',
  secondaryText: '#9CA3AF',
  card: '#1F2937',
  border: '#374151',
  primary: '#818CF8',
  error: '#F87171',
  success: '#34D399',
};

//theme violet
// background: linear-gradient(30deg, rgba(146,163,253,1) 50%, rgba(157,206,255,1) 100%);


// theme salt
//background: linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%);

interface SettingsState {
  darkMode: boolean;
  theme: Theme;
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    weeklyReport: boolean;
    achievementAlerts: boolean;
  };
  toggleDarkMode: () => void;
  updateNotificationSetting: (key: keyof SettingsState['notifications'], value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      theme: lightTheme,
      notifications: {
        enabled: true,
        dailyReminder: true,
        weeklyReport: true,
        achievementAlerts: true,
      },
      toggleDarkMode: () =>
        set((state) => ({ 
          darkMode: !state.darkMode,
          theme: !state.darkMode ? darkTheme : lightTheme,
        })),
      updateNotificationSetting: (key, value) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [key]: value,
          },
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);