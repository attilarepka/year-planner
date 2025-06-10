import { DayButtonProps } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { formatDate, getEvent, isHoliday } from "@/lib/calendar-util";
import { ComponentType } from "react";
import { House, Palmtree, PartyPopper } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { PlanType } from "@/app/_providers/app-state-context";
import { usePrintContext } from "@/app/_providers/print-context";
import { useEventMap } from "@/app/_providers/event-map-context";
import { useAppSettings } from "@/app/_providers/app-settings-context";
import { useHolidays } from "@/app/_providers/holidays-context";
import { CalendarHeader } from "./calendar-header";

export function CalendarView({
  onSelect
}: {
  onSelect: (date: Date[] | undefined) => void;
}) {
  const { appSettings } = useAppSettings();
  const { holidays } = useHolidays();
  const { eventMap } = useEventMap();
  const { printRef } = usePrintContext();

  const Formatter = ({
    icon: Icon,
    content,
    ...props
  }: {
    icon: ComponentType<{ className?: string }>;
    content: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button {...props}>
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );

  // TODO: slow calendar performance
  // https://github.com/shadcn-ui/ui/pull/4371
  return (
    <div ref={printRef}>
      <CalendarHeader />
      <div className="w-full flex justify-center">
        <Calendar
          mode={"multiple"}
          month={new Date(appSettings.currentYear, 0)}
          startMonth={new Date(appSettings.currentYear, 0)}
          endMonth={new Date(appSettings.currentYear, 11)}
          numberOfMonths={12}
          showOutsideDays={false}
          disableNavigation
          onSelect={onSelect}
          disabled={[
            { dayOfWeek: [0, 6] },
            (date) => {
              return isHoliday(formatDate(date), holidays) !== null;
            }
          ]}
          components={{
            DayButton: (props: DayButtonProps) => {
              const { day, ...buttonProps } = props;
              const date = formatDate(day.date);
              const holiday = isHoliday(date, holidays);
              if (holiday) {
                return (
                  <Formatter
                    icon={PartyPopper}
                    content={holiday.name}
                    {...buttonProps}
                  />
                );
              }
              const eventType = getEvent(date, eventMap);
              switch (eventType) {
                case PlanType.HomeOffice:
                  return (
                    <Formatter
                      icon={House}
                      content="Home office"
                      {...buttonProps}
                    />
                  );
                case PlanType.AnnualLeave:
                  return (
                    <Formatter
                      icon={Palmtree}
                      content="Annual leave"
                      {...buttonProps}
                    />
                  );
                default:
                  return <button {...buttonProps} />;
              }
            }
          }}
          formatters={{
            formatCaption: (date) =>
              date.toLocaleString("default", { month: "long" })
          }}
        />
      </div>
    </div>
  );
}
