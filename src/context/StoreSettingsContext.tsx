import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SiteSettings, 
  DEFAULT_SITE_SETTINGS, 
  fetchSiteSettingsFromSupabase, 
  saveSiteSettingsInSupabase, 
  isSupabaseConfigured 
} from '../lib/supabase';

interface StoreSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>;
  resetToDefaults: () => void;
  isLoadingSettings: boolean;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'new_madina_site_settings_v1';

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse cached site settings', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // Sync from Supabase on mount
  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsLoadingSettings(true);
      fetchSiteSettingsFromSupabase()
        .then((remote) => {
          if (remote) {
            setSettings(remote);
            try {
              localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(remote));
            } catch (e) {}
          }
        })
        .finally(() => setIsLoadingSettings(false));
    }
  }, []);

  const updateSettings = async (partial: Partial<SiteSettings>): Promise<boolean> => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    if (isSupabaseConfigured()) {
      const res = await saveSiteSettingsInSupabase(updated);
      return res.success;
    }
    return true;
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
    } catch (e) {}
    if (isSupabaseConfigured()) {
      saveSiteSettingsInSupabase(DEFAULT_SITE_SETTINGS);
    }
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefaults,
        isLoadingSettings
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) {
    return {
      settings: DEFAULT_SITE_SETTINGS,
      updateSettings: async () => false,
      resetToDefaults: () => {},
      isLoadingSettings: false
    };
  }
  return ctx;
};
