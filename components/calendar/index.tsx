import { formatDate } from "@/lib/calendar-util";
import { useToast } from "@/hooks/use-toast";
import { PlanType, useAppState } from "@/app/_providers/app-state-context";
import { useEventMap } from "@/app/_providers/event-map-context";
import { CalendarView } from "./calendar-view";

export function Calendar() {
  const { toast } = useToast();
  const { planType, remainingHomeOffice, remainingAnnualLeave } = useAppState();
  const { setEventMap } = useEventMap();

  const handleOnSelect = (day: Date[] | undefined) => {
    if (!day) return;

    if (planType === PlanType.HomeOffice && remainingHomeOffice < 1) {
      toast({
        variant: "destructive",
        description: "No more Home Office days remaining."
      });
      return;
    }

    if (planType === PlanType.AnnualLeave && remainingAnnualLeave < 1) {
      toast({
        variant: "destructive",
        description: "No more Annual Leave days remaining."
      });
      return;
    }
    setEventMap((prevMap) =>
      new Map(prevMap).set(formatDate(day[0]), planType)
    );
  };

  return (
    <>
      <CalendarView onSelect={handleOnSelect} />
    </>
  );
}
