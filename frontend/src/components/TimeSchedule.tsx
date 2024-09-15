import { Info } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import type { Availability, Day } from "@/api/services/availability-service";
import availabilityService from "@/api/services/availability-service";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import LoadingComponent from "@/components/loading";

import { useRequest } from "@/hooks/use-request";

const DEFAULT_DAYS: Record<
  Day,
  { name: Day; checked: boolean; start: string; end: string }
> = {
  monday: { name: "monday", checked: false, start: "00:00", end: "00:00" },
  tuesday: { name: "tuesday", checked: false, start: "00:00", end: "00:00" },
  wednesday: {
    name: "wednesday",
    checked: false,
    start: "00:00",
    end: "00:00",
  },
  thursday: { name: "thursday", checked: false, start: "00:00", end: "00:00" },
  friday: { name: "friday", checked: false, start: "00:00", end: "00:00" },
  saturday: { name: "saturday", checked: false, start: "00:00", end: "00:00" },
  sunday: { name: "sunday", checked: false, start: "00:00", end: "00:00" },
};

const DAYS_ORDER: Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

interface AvailabilityData {
  start_time: string;
  day: Day;
  end_time: string;
  id: string;
  user_id: string;
  is_available: boolean;
}

const mergeAvailabilityData = (fetchedDays: AvailabilityData[]) => {
  const daysState = { ...DEFAULT_DAYS };
  fetchedDays.forEach((data) => {
    daysState[data.day] = {
      name: data.day,
      checked: data.is_available,
      start: data.start_time.slice(0, 5),
      end: data.end_time.slice(0, 5),
    };
  });
  return Object.values(daysState).sort(
    (a, b) => DAYS_ORDER.indexOf(a.name) - DAYS_ORDER.indexOf(b.name),
  );
};

type TimeScheduleProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimeSchedule: React.FC<TimeScheduleProps> = ({ open, onOpenChange }) => {
  const [businessHours, setBusinessHours] = useState(false);
  const [days, setDays] = useState(() => Object.values(DEFAULT_DAYS));

  const {
    loading: getReoccurringAvailabilityLoading,
    request: getReoccurringAvailability,
  } = useRequest<void>(() => availabilityService.getReoccurringAvailability(), {
    successCallback: (result) => {
      setDays(mergeAvailabilityData(result));
    },
  });

  const {
    loading: saveReoccurringAvailabilityLoading,
    request: saveReoccurringAvailability,
  } = useRequest<Availability[]>(
    (params) => availabilityService.saveReoccurringAvailability(params),
    {
      successToast: true,
      successMessage: "Availability schedule updated successfully",
      errorToast: true,
      errorMessage: "Failed to update availability",
    },
  );

  useEffect(() => {
    if (open) {
      getReoccurringAvailability();
    }
  }, [open]);

  useEffect(() => {
    if (businessHours) {
      setDays((prevDays) =>
        prevDays.map((day, index) =>
          index < 5
            ? { ...day, checked: true, start: "09:00", end: "18:00" }
            : day,
        ),
      );
    } else {
      setDays((prevDays) =>
        prevDays.map((day, index) =>
          index < 5 ? { ...day, checked: false } : day,
        ),
      );
    }
  }, [businessHours]);

  const handleSave = () => {
    let availabilities = days.map((day) => ({
      day: day.name,
      is_available: day.checked,
      start_time: day.start,
      end_time: day.end,
    }));
    saveReoccurringAvailability(availabilities);
  };

  const handleDayChange = (index: number, checked: boolean) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      newDays[index].checked = checked;
      return newDays;
    });
  };

  const handleTimeChange = (index: number, start: string, end: string) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      newDays[index].start = start;
      newDays[index].end = end;
      return newDays;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className={"flex gap-2"}>
        <Button variant="outline">Change</Button>
      </DialogTrigger>
      <DialogContent className="min-w-max">
        <DialogHeader>
          <DialogTitle>Recurring Availability</DialogTitle>
          <DialogDescription>
            Adjust your availability schedule
          </DialogDescription>
          <div className={"flex flex-col gap-2"}>
            <div
              className={
                "border rounded-lg mt-2 px-4 py-2 flex justify-between items-center gap-2 mb-4"
              }
            >
              <div className={"flex items-center gap-2"}>
                <Info className={"h-[1.2rem] w-[1.2rem]"} />
                <Label className={"text-sm"}>
                  This affects booking availability for your services.
                </Label>
              </div>
            </div>
            {getReoccurringAvailabilityLoading ? (
              <LoadingComponent />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <Label
                    htmlFor="business-hours-switch"
                    className="flex flex-col"
                  >
                    <span className="font-semibold">Business hours</span>
                    <span className="text-xs font-normal">
                      Quickly enable or disable business hours
                    </span>
                  </Label>
                  <Switch
                    id="business-hours-switch"
                    checked={businessHours}
                    onCheckedChange={setBusinessHours}
                  />
                </div>
                <div>
                  {days.map((day, index) => (
                    <div
                      key={day.name}
                      className="flex justify-between items-center mb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={day.name}
                          checked={day.checked}
                          onCheckedChange={(checked) =>
                            handleDayChange(index, checked as boolean)
                          }
                        />
                        <label
                          htmlFor={day.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.name.slice(0, 1).toUpperCase() +
                            day.name.slice(1)}
                        </label>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="time"
                          disabled={!day.checked}
                          value={day.start}
                          onChange={(e) =>
                            handleTimeChange(index, e.target.value, day.end)
                          }
                          className="p-1 border rounded-full"
                        />
                        <span className="mx-1">-</span>
                        <input
                          type="time"
                          disabled={!day.checked}
                          value={day.end}
                          onChange={(e) =>
                            handleTimeChange(index, day.start, e.target.value)
                          }
                          className="p-1 w-max border rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className={"flex gap-2 justify-center"}>
              <DialogClose asChild>
                <Button
                  disabled={
                    getReoccurringAvailabilityLoading ||
                    saveReoccurringAvailabilityLoading
                  }
                  className={"w-full"}
                  variant={"outline"}
                  type={"button"}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  disabled={
                    getReoccurringAvailabilityLoading ||
                    saveReoccurringAvailabilityLoading
                  }
                  className={"w-full"}
                  type="submit"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSchedule;
