import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import AdvancedCalendar from "@/components/AdvancedCalendar";
import AvailabilityCalendar from "@/components/availabillty";

const availableDates = [
  "2024-07-10",
  "2024-07-12",
  "2024-07-15",
  // Add more dates as needed
];

const events = [
  {
    date: "2024-07-10",
    time: "07:00",
    endTime: "08:00",
    title: "Show project to Jes Parker",
    category: "Clients",
  },
  {
    date: "2024-07-12",
    time: "09:30",
    endTime: "10:30",
    title: "Meet Jason at the International Airport",
    category: "Personal",
  },
  {
    date: "2024-07-15",
    time: "07:00",
    endTime: "08:00",
    title: "Meeting with a team",
    category: "Work",
  },
  // Add more events as needed
];

export default function AvailabilityCalender() {
  const handleDateSelect = (date: string) => {
    console.log("Selected date:", date);
  };
  return (
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex justify-center items-center">
        <div className="flex flex-col w-full space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Availability Calendar
          </h2>
          <Label className="text-muted-foreground">
            Schedule availability for your services
          </Label>
        </div>
      </div>
      <Separator className="my-6" />
      {/* code a availability calender below */}
      {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-4 text-center">
            My Availability Calendar
          </h1>
          <AvailabilityCalendar
            availableDates={availableDates}
            onDateSelect={handleDateSelect}
          />
        </div>
      </div> */}
      {/* <div className="min-h-screen flex items-center justify-center bg-gray-100"> */}
      {/* <AdvancedCalendar events={events} onDateSelect={handleDateSelect} /> */}
      {/* </div> */}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <AdvancedCalendar events={events} onDateSelect={handleDateSelect} />
      </div>
    </div>
  );
}
