"use client";
import { getHolidays, Holiday } from "@/lib/calendar-util";
import React, { createContext, useCallback, useContext, useState } from "react";

type HolidaysContextType = {
  holidays: Holiday[];
  loadHolidays: (year: number, country: string) => Promise<void>;
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

  const loadHolidays = useCallback(async (year: number, country: string) => {
    try {
      const fetchedHolidays = await getHolidays(year, country);
      setHolidays(fetchedHolidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  }, []);

  return (
    <HolidaysContext.Provider value={{ holidays, loadHolidays }}>
      {children}
    </HolidaysContext.Provider>
  );
};
