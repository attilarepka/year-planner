"use client";
import { getHolidays, getLongWeekends, Holiday, LongWeekend } from "@/lib/calendar-util";
import React, { createContext, useCallback, useContext, useState } from "react";

type HolidaysContextType = {
  holidays: Holiday[];
  longWeekends: LongWeekend[];
  loadHolidays: (year: number, country: string) => Promise<void>;
  loadLongWeekends: (year: number, country: string) => Promise<void>;
};

const HolidaysContext = createContext<HolidaysContextType | undefined>(
  undefined
);

export const useHolidays = () => {
  const context = useContext(HolidaysContext);
  if (!context) {
    throw new Error("useHolidays must be used within a HolidaysProvider");
  }
  return context;
};

export const HolidaysProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [longWeekends, setLongWeekends] = useState<LongWeekend[]>([]);

  const loadHolidays = useCallback(async (year: number, country: string) => {
    try {
      const fetchedHolidays = await getHolidays(year, country);
      setHolidays(fetchedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  }, []);

  const loadLongWeekends = useCallback(async (year: number, country: string) => {
    try {
      const fetchedLongWeekends = await getLongWeekends(year, country);
      setLongWeekends(fetchedLongWeekends);
    } catch (error) {
      console.error("Error fetching long weekends:", error);
    }
  }, []);

  return (
    <HolidaysContext.Provider value={{ holidays, longWeekends, loadHolidays, loadLongWeekends }}>
      {children}
    </HolidaysContext.Provider>
  );
};
