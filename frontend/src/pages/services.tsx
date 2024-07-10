import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Services() {
  return (
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex justify-center items-center">
        <div className="flex flex-col w-full space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            Service Management
          </h2>
          <Label className="text-muted-foreground">Manage your services</Label>
        </div>
        <div>
          <Link to={"/services/add"}>
            <Button>Add New Service</Button>
          </Link>
        </div>
      </div>
      <Separator className="my-6" />
    </div>
  );
}
