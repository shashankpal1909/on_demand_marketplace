import { PopoverClose } from "@radix-ui/react-popover";
import { Pencil, Trash2, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

import servicesService from "@/api/services/services-service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { Service } from "@/lib/types/services";
import { cn } from "@/lib/utils";

import { useRequest } from "@/hooks/use-request";

type ServiceCardProps = {
  service: Service;
  getAllServices: () => void;
};

export default function ServiceCard({
  service,
  getAllServices,
}: ServiceCardProps) {
  const navigate = useNavigate();

  const { loading: deleteServiceLoading, request: deleteService } =
    useRequest<string>((params) => servicesService.deleteService(params), {
      successToast: true,
      successMessage: "Service deleted successfully",
      successCallback: () => getAllServices(),
      errorToast: true,
      errorMessage: "Failed to delete service",
    });

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "border rounded-lg overflow-hidden",
          deleteServiceLoading && "bg-muted",
        )}
      >
        <div className={"flex justify-between items-center px-6 py-4"}>
          <div>
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-sm">{service.description}</p>
          </div>
          <div className={"flex gap-2"}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  disabled={deleteServiceLoading}
                  onClick={() => navigate(`/services/${service.id}/edit`)}
                >
                  <Pencil className={"w-[1.2rem] h-[1.2rem]"} />
                </Button>
              </TooltipTrigger>
              <TooltipContent asChild>
                <Label>Edit Service</Label>
              </TooltipContent>
            </Tooltip>
            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      disabled={deleteServiceLoading}
                    >
                      <Trash2 className={"w-[1.2rem] h-[1.2rem]"} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent asChild>
                    <Label>Delete Service</Label>
                  </TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent asChild>
                <div className={"flex flex-col text-center gap-2 w-fit"}>
                  <div>
                    <Label className={"font-semibold text-lg"}>
                      Delete Service?
                    </Label>
                  </div>
                  <div className={"flex flex-col gap-2"}>
                    <Label>
                      Are you sure you want to delete{" "}
                      <span className={"font-semibold"}>
                        "{service.title}"?
                      </span>
                    </Label>
                    <Label className={"rounded-full text-destructive"}>
                      <div className={"flex justify-center items-center gap-2"}>
                        <TriangleAlert />
                        <span>You can't undo this action.</span>
                      </div>
                    </Label>
                  </div>
                  <div className={"flex gap-2 mt-2 justify-center"}>
                    <PopoverClose asChild>
                      <Button variant={"secondary"}>Cancel</Button>
                    </PopoverClose>
                    <PopoverClose>
                      <Button
                        variant={"destructive"}
                        type={"button"}
                        onClick={() => deleteService(service.id)}
                      >
                        Confirm
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
            <Badge variant={"secondary"} key={tag.id} className="mr-2">
              {tag.text}
            </Badge>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
