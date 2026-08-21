import { PlanType } from "@/app/_providers/app-state-context";

const apiBase: string = "https://date.nager.at/api/v3/";
const publicHolidays: string = "publicholidays/";
const longWeekends: string = "longweekend/";
const availableCountries: string = "availablecountries/";
const pathSeparator: string = "/";

interface Country {
  name: string;
  countryCode: string;
}

interface Holiday {
  date: string;
  localName: string;
  name: string;
}

interface LongWeekend {
  startDate: string;
  endDate: string;
  dayCount: number;
  needBridgeDay: boolean;
  bridgeDays: string[];
}

const fetchData = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  return response.json() as Promise<T>;
};

const getHolidays = async (
  year: number,
  locale: string
): Promise<Holiday[]> => {
  const url = apiBase + publicHolidays + year + pathSeparator + locale;
  return fetchData<Holiday[]>(url);
};

const getCountries = async (): Promise<Country[]> => {
  const url = apiBase + availableCountries;
  return fetchData<Country[]>(url);
};

const getLongWeekends = async (
  year: number,
  countryCode: string
): Promise<LongWeekend[]> => {
  const url = apiBase + longWeekends + year + pathSeparator + countryCode;
  return fetchData<LongWeekend[]>(url);
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isHoliday = (date: string, holidays: Holiday[]): Holiday | null => {
  const holidayMatch = holidays.find((holiday) => {
    return date === formatDate(new Date(holiday.date));
  });

  return holidayMatch || null;
};

const getEvent = (date: string, event: Map<string, PlanType>): PlanType => {
  return event.get(date) || PlanType.Default;
};

export {
  getHolidays,
  getCountries,
  getLongWeekends,
  isHoliday,
  getEvent,
  formatDate
};
export type { Holiday, Country, LongWeekend };
