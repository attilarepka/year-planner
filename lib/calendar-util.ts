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
}

const fetchData = async <T>(url: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data as T))
      .catch((error) => reject(error));
  });
};

const getCountriesApi = (): string => {
  return apiBase + availableCountries;
};

const getPublicHolidaysApi = (year: number, locale: string): string => {
  return apiBase + publicHolidays + year + pathSeparator + locale;
};

const getLongWeekendApi = (year: number, countryCode: string): string => {
  return apiBase + longWeekends + year + pathSeparator + countryCode;
};

const getHolidays = async (
  year: number,
  locale: string
): Promise<Holiday[]> => {
  const url = getPublicHolidaysApi(year, locale);
  return await fetchData<Holiday[]>(url);
};

const getCountries = async (): Promise<Country[]> => {
  const url = getCountriesApi();
  return await fetchData<Country[]>(url);
};

const getLongWeekends = async (
  year: number,
  countryCode: string
): Promise<LongWeekend[]> => {
  const url = getLongWeekendApi(year, countryCode);
  return await fetchData<LongWeekend[]>(url);
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
