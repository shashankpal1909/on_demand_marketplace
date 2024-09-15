import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import servicesService from "@/api/services/services-service";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import Loading from "@/components/loading";
import ServiceCard from "@/components/service-card";

import type { Service } from "@/lib/types/services";

import { useRequest } from "@/hooks/use-request";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  const { loading: getAllServicesLoading, request: getAllServices } =
    useRequest(() => servicesService.getAllServices(), {
      successCallback: (result) => setServices(result),
    });

  useEffect(() => {
    getAllServices();
  }, []);

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
      {getAllServicesLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              getAllServices={getAllServices}
            />
          ))}
        </div>
      )}
    </div>
  );
}
