"use client";
import React, { createContext, useContext, useState } from "react";

type AppSettings = {
  country: string;
  homeOfficeLimit: number;
  annualLeaveLimit: number;
  currentYear: number;
};

type AppSettingsContextType = {
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined
);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider"
    );
  }
  return context;
};

export const AppSettingsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [appSettings, setAppSettings] = useState<AppSettings>({
    country: "",
    homeOfficeLimit: 0,
    annualLeaveLimit: 0,
    currentYear: 0
  });

  return (
    <AppSettingsContext.Provider
      value={{
        appSettings,
        setAppSettings
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};
