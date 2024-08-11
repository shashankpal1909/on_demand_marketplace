import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import servicesService from "@/api/services/services-service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tag {
  service_id: string;
  id: string;
  text: string;
}

interface Service {
  id: string;
  pricing: number;
  location: string;
  created_at: string;
  title: string;
  description: string;
  pricing_type: "fixed" | "hourly";
  provider_id: string;
  updated_at: string | null;
  tags: Tag[];
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  return (
    <TooltipProvider delayDuration={0}>
      <div className="border rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-sm">{service.description}</p>
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  onClick={() => navigate(`/services/${service.id}/edit`)}
                >
                  <Edit className={"w-[1.2rem] h-[1.2rem]"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent asChild>
                <Label>Edit Service</Label>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="px-6 py-4 border-t">
          <div className="font-medium">
            ${service.pricing}{" "}
            <span className="text-sm">/ {service.pricing_type}</span>
          </div>
          <div className="text-sm">{service.location}</div>
          <div className="text-xs">
            Created at: {new Date(service.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="px-6 py-4">
          {service.tags.map((tag) => (
            <Badge key={tag.id} className="mr-2">
              {tag.text}
            </Badge>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    servicesService
      .getAllServices()
      .then((response) => {
        setServices(response);
      })
      .catch((error) => {
        console.log(error);
      });
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
      {/*<pre>{JSON.stringify(services, null, 2)}</pre>*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
