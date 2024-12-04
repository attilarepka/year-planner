import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CalendarView } from "./calendar-view";
import { PlanType } from "@/app/_providers/app-state-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/app/_providers/app-state-context";
import * as AppSettingsContext from "@/app/_providers/app-settings-context";
import * as HolidaysContext from "@/app/_providers/holidays-context";
import * as EventMapContext from "@/app/_providers/event-map-context";
import * as PrintContext from "@/app/_providers/print-context";

const mockContexts = (overrides = {}) => {
  vi.spyOn(AppSettingsContext, "useAppSettings").mockReturnValue({
    appSettings: {
      currentYear: 2024,
      homeOfficeLimit: 2,
      annualLeaveLimit: 2
    },
    ...overrides.appSettings
  });
  vi.spyOn(HolidaysContext, "useHolidays").mockReturnValue({
    holidays: [],
    ...overrides.holidays
  });
  vi.spyOn(EventMapContext, "useEventMap").mockReturnValue({
    eventMap: new Map<string, PlanType>(),
    ...overrides.eventMap
  });
  vi.spyOn(PrintContext, "usePrintContext").mockReturnValue({
    printRef: { current: null },
    ...overrides.printContext
  });
};

const renderCalendarView = (onSelect = vi.fn()) => {
  render(
    <TooltipProvider>
      <AppStateProvider>
        <CalendarView onSelect={onSelect} />
      </AppStateProvider>
    </TooltipProvider>
  );
  return onSelect;
};

describe("CalendarView", () => {
  let mockOnSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSelect = vi.fn();
  });

  it("renders the CalendarView component", () => {
    mockContexts();
    renderCalendarView(mockOnSelect);

    expect(screen.getByText("January")).toBeInTheDocument();
  });

  it("disables weekends and holidays", () => {
    mockContexts({
      holidays: {
        holidays: [{ name: "New Year's Day", date: new Date("2024-01-01") }]
      }
    });
    renderCalendarView(mockOnSelect);

    const publicHolidayCell = document.querySelector(".lucide-party-popper");

    expect(publicHolidayCell).toBeInTheDocument();
    expect(publicHolidayCell.closest("button")).toBeDisabled();
  });

  it("displays icons for different event types", () => {
    mockContexts({
      eventMap: {
        eventMap: new Map<string, PlanType>([
          ["2024-01-01", PlanType.HomeOffice]
        ])
      }
    });
    renderCalendarView(mockOnSelect);

    const homeOfficeIcon = document.querySelector(".lucide-house");
    expect(homeOfficeIcon).toBeInTheDocument();
  });

  it("triggers the onSelect callback when a valid date is selected", () => {
    mockContexts();
    renderCalendarView(mockOnSelect);

    const selectableDay = screen.getAllByText("3")[0];

    fireEvent.click(selectableDay.closest("button")!);
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it("does not allow selecting a disabled date", () => {
    mockContexts({
      holidays: {
        holidays: [{ name: "New Year's Day", date: new Date("2024-01-01") }]
      }
    });
    renderCalendarView(mockOnSelect);

    const disabledHoliday = document.querySelector(".lucide-party-popper");

    expect(disabledHoliday).toBeInTheDocument();
    fireEvent.click(disabledHoliday.closest("button")!);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});
