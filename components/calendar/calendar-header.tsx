import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import { Toggle } from "@radix-ui/react-toggle";
import { House, Palmtree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { PlanType, useAppState } from "@/app/_providers/app-state-context";

export function CalendarHeader() {
  const { planType, setPlanType, remainingHomeOffice, remainingAnnualLeave } =
    useAppState();

  return (
    <div className="grid items-center justify-items-center pt-4 pb-2">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">{siteConfig.title}</h4>
        <p className="text-sm text-muted-foreground">
          {siteConfig.description}
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <Toggle
          className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 data-[state=on]:bg-zinc-300 dark:data-[state=on]:bg-zinc-700"
          pressed={planType === PlanType.HomeOffice}
          onPressedChange={(pressed) => {
            setPlanType(pressed ? PlanType.HomeOffice : PlanType.Default);
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <House className="h-6 w-5" />
            </TooltipTrigger>
            <TooltipContent>Home Office</TooltipContent>
          </Tooltip>
        </Toggle>
        <Separator orientation="vertical" />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex space-x-1">
              <Badge
                variant={remainingHomeOffice < 1 ? "destructive" : "outline"}
              >
                {remainingHomeOffice}
              </Badge>
              <p className="font-bold">/</p>
              <Badge
                variant={remainingAnnualLeave < 1 ? "destructive" : "outline"}
              >
                {remainingAnnualLeave}
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent>Remaining: Home Office / Annual Leave</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" />
        <Toggle
          className="p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-600 data-[state=on]:bg-zinc-300 dark:data-[state=on]:bg-zinc-700"
          pressed={planType === PlanType.AnnualLeave}
          onPressedChange={(pressed) => {
            setPlanType(pressed ? PlanType.AnnualLeave : PlanType.Default);
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Palmtree className="h-6 w-5" />
            </TooltipTrigger>
            <TooltipContent>Annual Leave</TooltipContent>
          </Tooltip>
        </Toggle>
      </div>
    </div>
  );
}
