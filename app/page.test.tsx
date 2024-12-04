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
  const MockedTooltipProvider: React.FC = ({ children }) => (
    <TooltipProvider>{children}</TooltipProvider>
  );
  it("renders the YearForm when planMode is true", () => {
    vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
      planMode: true
    });
    vi.spyOn(EventMapContext, "useEventMap").mockReturnValue({
      eventMap: new Map<string, AppStateContext.PlanType>()
    });
    vi.spyOn(AppSettingsContext, "useAppSettings").mockReturnValue({
      appSettings: {}
    });
    vi.spyOn(HolidaysContext, "useHolidays").mockReturnValue({
      holidays: []
    });
    vi.spyOn(PrintContext, "usePrintContext").mockReturnValue({
      printRef: { current: null }
    });

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
    });

    render(<Home />);

    expect(screen.getByText("Selected Year")).toBeInTheDocument();
  });
});
