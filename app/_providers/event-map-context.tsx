"use client";
import React, { createContext, useContext, useState } from "react";
import { PlanType } from "./app-state-context";

type EventMapContextType = {
  eventMap: Map<string, PlanType>;
  setEventMap: React.Dispatch<React.SetStateAction<Map<string, PlanType>>>;
};

const EventMapContext = createContext<EventMapContextType | undefined>(
  undefined
);

export const useEventMap = () => {
  const context = useContext(EventMapContext);
  if (!context) {
    throw new Error("useEventMap must be used within an EventMapProvider");
  }
  return context;
};

export const EventMapProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [eventMap, setEventMap] = useState<Map<string, PlanType>>(new Map());

  return (
    <EventMapContext.Provider value={{ eventMap, setEventMap }}>
      {children}
    </EventMapContext.Provider>
  );
};
