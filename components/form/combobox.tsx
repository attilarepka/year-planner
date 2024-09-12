import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ControllerRenderProps } from "react-hook-form";
import { useEffect, useState, forwardRef } from "react";
import { Country, getCountries } from "@/lib/calendar-util";

export const FormCombobox = forwardRef<
  HTMLButtonElement,
  ControllerRenderProps
>(({ onChange, value }, ref) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (newValue: string) => {
    if (newValue === value) {
      newValue = "";
    }
    onChange(newValue);
    setOpen(false);
  };

  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const countries = await getCountries();
        setCountries(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    })();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? countries.find((country) => country.countryCode === value)?.name
            : "Select Country..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country.countryCode}
                  value={country.name}
                  onSelect={() => handleSelect(country.countryCode)}
                >
                  {country.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === country.countryCode
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

FormCombobox.displayName = "FormCombobox";
