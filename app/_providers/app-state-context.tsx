"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import { z } from "zod";
import { useEventMap } from "./event-map-context";
import { useAppSettings } from "./app-settings-context";
import { useHolidays } from "./holidays-context";

const yearStart = new Date().getFullYear() - 5;
const yearEnd = new Date().getFullYear() + 5;

const formSchema = z.object({
  selectedYear: z.coerce
    .number()
    .gte(yearStart)
    .lte(yearEnd, {
      message: `Year must be between ${yearStart} and ${yearEnd}`
    }),
  homeOffice: z.coerce
    .number()
    .gte(0)
    .lte(366, { message: "Home office days must be between 0 and 366" }),
  annualLeave: z.coerce
    .number()
    .gte(0)
    .lte(366, { message: "Annual leave days must be between 0 and 366" }),
  country: z.string().min(1, { message: "Country must be selected" })
});

export type FormValues = z.infer<typeof formSchema>;

export function useFormState(): {
  formSchema: typeof formSchema;
  yearStart: number;
  yearEnd: number;
} {
  return { formSchema, yearStart, yearEnd };
}

export enum PlanType {
  Default,
  HomeOffice,
  AnnualLeave
}

const monthMap: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11
};

type AppState = {
  planMode: boolean;
  planType: PlanType;
  setPlanType: React.Dispatch<React.SetStateAction<PlanType>>;
  remainingHomeOffice: number;
  remainingAnnualLeave: number;
  updateAppState: (data: FormValues) => void;
  resetAppState: () => void;
  loadAppState: (state: string) => void;
  saveAppState: () => string;
  isInProgress: () => boolean;
};

const StateContext = createContext<AppState | undefined>(undefined);

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
}

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [planMode, setPlanMode] = useState(false);
  const [planType, setPlanType] = useState(PlanType.Default);
  const [remainingHomeOffice, setRemainingHomeOffice] = useState<number>(0);
  const [remainingAnnualLeave, setRemainingAnnualLeave] = useState<number>(0);

  const { loadHolidays } = useHolidays();
  const { appSettings, setAppSettings } = useAppSettings();
  const { eventMap, setEventMap } = useEventMap();

  useEffect(() => {
    if (appSettings.currentYear && appSettings.country) {
      loadHolidays(appSettings.currentYear, appSettings.country);
    }
  }, [appSettings, loadHolidays]);

  useEffect(() => {
    let homeOfficeCount = 0;
    let annualLeaveCount = 0;

    eventMap.forEach((planType) => {
      if (planType === PlanType.HomeOffice) {
        homeOfficeCount++;
      }
      if (planType === PlanType.AnnualLeave) {
        annualLeaveCount++;
      }
    });
    setRemainingHomeOffice(appSettings.homeOfficeLimit - homeOfficeCount);
    setRemainingAnnualLeave(appSettings.annualLeaveLimit - annualLeaveCount);
  }, [appSettings.annualLeaveLimit, appSettings.homeOfficeLimit, eventMap]);

  const updateAppState = (data: FormValues) => {
    setAppSettings({
      ...appSettings,
      currentYear: data.selectedYear,
      country: data.country,
      homeOfficeLimit: data.homeOffice,
      annualLeaveLimit: data.annualLeave
    });
    setPlanMode(true);
  };

  const resetAppState = () => {
    setPlanMode(false);
    setPlanType(PlanType.Default);
    setEventMap(new Map());
  };

  type SerializedAppState = {
    schemaVersion: string;
    currentYear: number;
    country: string;
    homeOfficeLimit: number;
    annualLeaveLimit: number;
    days: {
      homeoffice: Record<string, number[]>;
      annual: Record<string, number[]>;
    };
  };

  const saveAppState = (): string => {
    const daysByType = (type: PlanType) => {
      const days: Record<string, number[]> = {};

      eventMap.forEach((eventType, dateStr) => {
        if (eventType === type) {
          const date = new Date(dateStr);
          const monthName = date.toLocaleString("default", { month: "long" });
          const day = date.getDate();

          if (!days[monthName]) {
            days[monthName] = [];
          }
          days[monthName].push(day);
        }
      });

      return days;
    };

    const serialized: SerializedAppState = {
      schemaVersion: "1.1",
      country: appSettings.country,
      homeOfficeLimit: appSettings.homeOfficeLimit,
      annualLeaveLimit: appSettings.annualLeaveLimit,
      currentYear: appSettings.currentYear,
      days: {
        homeoffice: daysByType(PlanType.HomeOffice),
        annual: daysByType(PlanType.AnnualLeave)
      }
    };

    return JSON.stringify(serialized);
  };

  const loadAppState = (state: string) => {
    try {
      const data: SerializedAppState = JSON.parse(state);
      const { currentYear, country, homeOfficeLimit, annualLeaveLimit, days } =
        data;

      setAppSettings({
        country,
        homeOfficeLimit,
        annualLeaveLimit,
        currentYear
      });

      const newEventMap = new Map<string, PlanType>();

      const addEvents = (
        planType: PlanType,
        daysMap: Record<string, number[]>
      ) => {
        Object.entries(daysMap).forEach(([month, daysArray]) => {
          const monthIndex = monthMap[month];
          if (monthIndex === undefined) {
            throw new Error(`Invalid month name: ${month}`);
          }
          daysArray.forEach((day) => {
            const date = new Date(Date.UTC(currentYear, monthIndex, day));
            newEventMap.set(date.toISOString().split("T")[0], planType);
          });
        });
      };

      addEvents(PlanType.HomeOffice, days.homeoffice);
      addEvents(PlanType.AnnualLeave, days.annual);

      setEventMap(newEventMap);
      setPlanMode(true);
    } catch (error) {
      console.error("Error loading app state:", error);
    }
  };

  const isInProgress = () => {
    return planMode && eventMap.size > 0;
  };

  const value = {
    planMode,
    planType,
    setPlanType,
    remainingHomeOffice,
    remainingAnnualLeave,
    updateAppState,
    resetAppState,
    loadAppState,
    saveAppState,
    isInProgress
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};
