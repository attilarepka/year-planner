"use client";
import React, { createContext, useContext, useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface PrintContextType {
  onPrint: () => void;
  printRef: React.RefObject<HTMLDivElement | null>;
}

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export const PrintProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const onPrint = useReactToPrint({
    contentRef: printRef
  });

  return (
    <PrintContext.Provider value={{ onPrint, printRef }}>
      {children}
    </PrintContext.Provider>
  );
};

export const usePrintContext = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error("usePrintContext must be used within a PrintProvider");
  }
  return context;
};
