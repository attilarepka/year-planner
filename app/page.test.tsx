import { render, screen } from "@testing-library/react";
import { expect, describe, it, vi } from "vitest";
import Home from "@/app/page";
import * as AppStateContext from "@/app/_providers/app-state-context";
import * as EventMapContext from "@/app/_providers/event-map-context";
import * as AppSettingsContext from "@/app/_providers/app-settings-context";
import * as HolidaysContext from "@/app/_providers/holidays-context";
import * as PrintContext from "@/app/_providers/print-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";

describe("Home Page", () => {
  const MockedTooltipProvider = ({ children }: { children?: any }) => (
    <TooltipProvider>{children}</TooltipProvider>
  );
  it("renders the YearForm when planMode is true", () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: true
    } as any);
    vi.spyOn(EventMapContext, "useEventMap").mockReturnValue({
      eventMap: new Map<string, AppStateContext.PlanType>()
    } as any);
    vi.spyOn(AppSettingsContext, "useAppSettings").mockReturnValue({
      appSettings: {
        currentYear: new Date().getFullYear()
      }
    } as any);
    vi.spyOn(HolidaysContext, "useHolidays").mockReturnValue({
      holidays: []
    } as any);
    vi.spyOn(PrintContext, "usePrintContext").mockReturnValue({
      printRef: { current: null }
    } as any);

    render(
      <MockedTooltipProvider>
        <Home />
      </MockedTooltipProvider>
    );

    expect(screen.getByText(siteConfig.title)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.description)).toBeInTheDocument();
  });

  it("renders the YearForm when planMode is false", () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: false
    } as any);

    render(<Home />);

    expect(screen.getByText("Selected Year")).toBeInTheDocument();
  });
});
