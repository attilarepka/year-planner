/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";
import {
  getHolidays,
  getCountries,
  getLongWeekends,
  isHoliday,
  getEvent,
  formatDate
} from "./calendar-util";
import { PlanType } from "@/app/_providers/app-state-context";

global.fetch = vi.fn();

describe("Utils", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("API Fetch Functions", () => {
    it("fetches holidays for a given year and locale", async () => {
      const mockHolidays = [
        {
          date: "2024-01-01",
          localName: "New Year's Day",
          name: "New Year's Day"
        }
      ];
      (fetch as any).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockHolidays)
      });

      const result = await getHolidays(2024, "US");
      expect(result).toEqual(mockHolidays);
      expect(fetch).toHaveBeenCalledWith(
        "https://date.nager.at/api/v3/publicholidays/2024/US"
      );
    });

    it("fetches available countries", async () => {
      const mockCountries = [
        { name: "United States", countryCode: "US" },
        { name: "Germany", countryCode: "DE" }
      ];
      (fetch as any).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockCountries)
      });

      const result = await getCountries();
      expect(result).toEqual(mockCountries);
      expect(fetch).toHaveBeenCalledWith(
        "https://date.nager.at/api/v3/availablecountries/"
      );
    });

    it("fetches long weekends for a given year and country", async () => {
      const mockLongWeekends = [
        {
          startDate: "2024-01-13",
          endDate: "2024-01-15",
          dayCount: 3,
          needBridgeDay: false
        }
      ];
      (fetch as any).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockLongWeekends)
      });

      const result = await getLongWeekends(2024, "US");
      expect(result).toEqual(mockLongWeekends);
      expect(fetch).toHaveBeenCalledWith(
        "https://date.nager.at/api/v3/longweekend/2024/US"
      );
    });
  });

  describe("Utility Functions", () => {
    it("formats a date correctly", () => {
      const date = new Date("2024-01-01");
      const formattedDate = formatDate(date);
      expect(formattedDate).toBe("2024-01-01");
    });

    it("identifies a holiday from a list of holidays", () => {
      const holidays = [
        {
          date: "2024-01-01",
          localName: "New Year's Day",
          name: "New Year's Day"
        },
        {
          date: "2024-12-25",
          localName: "Christmas Day",
          name: "Christmas Day"
        }
      ];
      const result = isHoliday("2024-01-01", holidays);
      expect(result).toEqual(holidays[0]);

      const noHoliday = isHoliday("2024-07-04", holidays);
      expect(noHoliday).toBeNull();
    });

    it("retrieves an event from a date map", () => {
      const eventMap = new Map<string, PlanType>([
        ["2024-01-01", PlanType.HomeOffice],
        ["2024-12-25", PlanType.AnnualLeave]
      ]);

      const event1 = getEvent("2024-01-01", eventMap);
      expect(event1).toBe(PlanType.HomeOffice);

      const eventDefault = getEvent("2024-07-04", eventMap);
      expect(eventDefault).toBe(PlanType.Default);
    });
  });
});
