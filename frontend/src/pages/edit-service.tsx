import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { X } from "lucide-react";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import type { z } from "zod";

import servicesService from "@/api/services/services-service";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { InputTags } from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { API_BASE_URL } from "@/lib/constants";
import { MAX_IMAGES_COUNT } from "@/lib/constants/services";
import schema from "@/lib/schemas/services";
import type { Service } from "@/lib/types/services";

import { useRequest } from "@/hooks/use-request";

async function getFileFromUrl(
  url: string,
  name: string,
  defaultType = "image/jpeg",
) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export default function EditServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<Service>();

  const [preview, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      pricingType: "fixed",
      pricing: 1,
      location: "",
      tags: [],
      media: [],
    },
  });

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.target.files || []);

    // Clear file input
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Check if the new files combined with the existing ones exceed the limit
    if (files.length + newFiles.length > MAX_IMAGES_COUNT) {
      toast({
        variant: "destructive",
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${MAX_IMAGES_COUNT} images.`,
      });
      return;
    }

    const combinedFiles = [...files, ...newFiles];
    setFiles(combinedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreview((prevPreview) => [...prevPreview, ...newPreviews]);

    // Update the form state with the combined files
    form.setValue("media", combinedFiles);
  }

  function handleRemoveFile(index: number) {
    const newFiles = [...files];
    newFiles.splice(index, 1); // Remove the selected file from the list
    setFiles(newFiles);

    const newPreviews = [...preview];
    newPreviews.splice(index, 1); // Remove the corresponding preview
    setPreview(newPreviews);

    // Update the form state with the modified files
    form.setValue("media", newFiles);
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    servicesService
      .updateService({ ...values, serviceId: serviceId! })
      .then(() => {
        toast({ title: "Service updated successfully" });
        navigate(`/services`);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: err.message,
        });
      });
  }

  function openFileDialog() {
    fileInputRef.current?.click(); // Programmatically open the file dialog
  }

  async function updateForm(service: Service) {
    form.setValue("name", service.title);
    form.setValue("pricing", service.pricing);
    form.setValue("description", service.description);
    form.setValue("category", service.category);
    let promises = service.media.map((file) => {
      return getFileFromUrl(`${API_BASE_URL}/files/${file.url}`, file.url);
    });
    form.setValue("media", await Promise.all(promises));
    form.setValue("location", service.location);
    form.setValue(
      "tags",
      service.tags.map((tag) => tag.text),
    );
    form.setValue("pricingType", service.pricing_type);

    const imgPreviewURLs = form
      .getValues("media")
      ?.map((file) => URL.createObjectURL(file));
    if (imgPreviewURLs) {
      setPreview(imgPreviewURLs);
      if (form.getValues("media")) setFiles(form.getValues("media") ?? []);
    }
  }

  useEffect(() => {
    if (service) {
      updateForm(service).then(() => {
        console.log(form);
        console.log("Service updated successfully");
        console.log(form.getValues("media"));
      });
    }
  }, [service]);

  const {} = useRequest(
    (serviceId) => servicesService.getService(serviceId),
    {
      successCallback: (response) => {
        setService(response);
      },
      errorCallback: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            navigate(`/not-found`);
          }
        }
      },
    },
  );

  useEffect(() => {
    if (serviceId) {
      servicesService
        .getService(serviceId)
        .then((res) => setService(res))
        .catch((e) => {
          console.log(e);
          if (e instanceof AxiosError) {
            if (e.response?.status === 404) {
              navigate(`/not-found`);
            }
          }
        });
    }
  }, [navigate, serviceId]);

  return (
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex flex-col w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Edit Service</h2>
        <Label className="text-muted-foreground">
          Edit your service details
        </Label>
      </div>
      <Separator className="my-6" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="pricing"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pricing ($)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pricingType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pricing Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="media"
            render={() => (
              <FormItem>
                <FormLabel>Media</FormLabel>
                <div className="grid grid-cols-6 gap-2">
                  {preview.map((url, index) => (
                    <div key={url} className="relative">
                      <Dialog>
                        <DialogTrigger>
                          <img
                            src={url}
                            width={"200px"}
                            alt="uploaded preview"
                            className="rounded"
                          />
                        </DialogTrigger>
                        <DialogContent className="lg:max-w-[75%] max-w-full">
                          <DialogHeader>
                            <DialogTitle>Preview</DialogTitle>
                            <DialogDescription className="flex justify-center">
                              <img
                                src={url}
                                className="rounded-md h-[75vh]"
                                alt="uploaded preview"
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <X
                        onClick={() => handleRemoveFile(index)}
                        className={
                          "cursor-pointer absolute bg-destructive m-1 text-white rounded-full top-0 right-0 z-10 w-[1.2rem] h-[1.2rem]"
                        }
                      />
                    </div>
                  ))}
                </div>
                <FormControl>
                  <>
                    <Button
                      type="button"
                      disabled={files.length >= MAX_IMAGES_COUNT}
                      onClick={openFileDialog}
                    >
                      Choose Files
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept={".jpg,.jpeg,.png"}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*<FormField*/}
          {/*  control={form.control}*/}
          {/*  name="tags"*/}
          {/*  render={({ field }) => (*/}
          {/*    <FormItem>*/}
          {/*      <FormLabel>Tags</FormLabel>*/}
          {/*      <FormControl>*/}
          {/*        <Input {...field} />*/}
          {/*      </FormControl>*/}
          {/*      <FormMessage />*/}
          {/*    </FormItem>*/}
          {/*  )}*/}
          {/*/>*/}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag(s)</FormLabel>
                <FormControl>
                  <InputTags {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
