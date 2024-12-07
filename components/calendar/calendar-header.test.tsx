import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { CalendarHeader } from "./calendar-header";
import * as AppSettingsContext from "@/app/_providers/app-settings-context";
import * as AppStateContext from "@/app/_providers/app-state-context";
import { siteConfig } from "@/config/site";
import { TooltipProvider } from "@/components/ui/tooltip";

const mockContexts = (overrides = {}) => {
  vi.spyOn(AppStateContext, "useAppState").mockReturnValue({
    planMode: false,
    setPlanType: vi.fn(),
    remainingHomeOffice: 5,
    remainingAnnualLeave: 10,
    ...overrides.appState
  });

  vi.spyOn(AppSettingsContext, "useAppSettings").mockReturnValue({
    appSettings: { currentYear: 2024 },
    ...overrides.appSettings
  });
};

const renderCalendarHeader = () => {
  render(
    <TooltipProvider>
      <CalendarHeader />
    </TooltipProvider>
  );
};

describe("CalendarHeader", () => {
  it("renders correctly with default state", async () => {
    mockContexts();
    renderCalendarHeader();

    expect(screen.getByText(siteConfig.title)).toBeInTheDocument();
    expect(screen.getByText(siteConfig.description)).toBeInTheDocument();

    const homeOfficeIcon = document.querySelector(".lucide-house");
    fireEvent.focus(homeOfficeIcon);
    expect(screen.getAllByText("Home Office")[0]).toBeInTheDocument();

    const annualLeaveIcon = document.querySelector(".lucide-tree-palm");
    fireEvent.focus(annualLeaveIcon);
    expect(screen.getAllByText("Annual Leave")[0]).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("handles toggling plan types", () => {
    const setPlanType = vi.fn();
    mockContexts({
      appState: {
        setPlanType
      }
    });
    renderCalendarHeader();

    const homeOfficeIcon = document.querySelector(".lucide-house");
    const annualLeaveIcon = document.querySelector(".lucide-tree-palm");

    fireEvent.click(homeOfficeIcon);
    expect(setPlanType).toHaveBeenCalledWith(
      AppStateContext.PlanType.HomeOffice
    );

    fireEvent.click(annualLeaveIcon);
    expect(setPlanType).toHaveBeenCalledWith(
      AppStateContext.PlanType.AnnualLeave
    );
  });

  it("displays badges with correct styles based on remaining days", () => {
    mockContexts({
      appState: {
        remainingHomeOffice: 0,
        remainingAnnualLeave: 2
      }
    });
    renderCalendarHeader();

    const homeOfficeBadge = screen.getByText("0");
    const annualLeaveBadge = screen.getByText("2");

    expect(homeOfficeBadge).toHaveClass("bg-destructive");
    expect(annualLeaveBadge).not.toHaveClass("bg-destructive");
  });
});
