import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FormValues,
  useAppState,
  useFormState
} from "@/app/_providers/app-state-context";
import { FormCombobox } from "./combobox";
import { CarouselPanel } from "./carousel";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

export function YearForm() {
  const { updateAppState } = useAppState();
  const { formSchema, yearStart, yearEnd } = useFormState();
  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      selectedYear: new Date().getFullYear(),
      homeOffice: 150,
      annualLeave: 20,
      country: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateAppState(values);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="selectedYear"
            render={() => (
              <FormItem>
                <FormLabel className="flex justify-center">
                  Selected Year
                </FormLabel>
                <FormControl>
                  <div className="flex w-full justify-center px-10 items-center">
                    <CarouselPanel
                      yearStart={yearStart}
                      yearEnd={yearEnd}
                      form={form}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-row gap-4 justify-center">
              <FormField
                control={form.control}
                name="homeOffice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-center">
                      Home Office Limit
                    </FormLabel>
                    <FormControl>
                      <Input className="text-center" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-center">
                      Annual Leave Limit
                    </FormLabel>
                    <FormControl>
                      <Input className="text-center" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-center">
                      Country
                    </FormLabel>
                    <FormControl>
                      <FormCombobox {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button type="submit">Generate Calendar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
