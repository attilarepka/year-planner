import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

// TODO: any
interface CarouselPanelProps {
  yearStart: number;
  yearEnd: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

export function CarouselPanel({
  yearStart,
  yearEnd,
  form
}: CarouselPanelProps) {
  const [api, setApi] = useState<CarouselApi>();

  const { setValue } = form;

  useEffect(() => {
    if (api) {
      api.on("select", () => {
        const newYearIndex = api.selectedScrollSnap();
        setValue("selectedYear", yearStart + newYearIndex);
      });
    }
  }, [api, setValue, yearStart]);

  return (
    <div className="flex w-full justify-center px-10 items-center">
      <Carousel
        opts={{
          align: "center",
          startIndex: (yearEnd - yearStart) / 2
        }}
        className="w-full max-w-sm"
        setApi={(api) => {
          setApi(api);
        }}
      >
        <CarouselContent>
          {Array.from(
            { length: yearEnd - yearStart + 1 },
            (_, index) => yearStart + index
          ).map((year) => (
            <CarouselItem key={year} aria-hidden className="pt-1 md:basis-1/2">
              <Card>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="select-none text-3xl font-semibold">
                    {year}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
