import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

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

import RequireAuth from "@/components/require-auth";

import type { CreateServiceDTO } from "@/lib/dtos";

import { useRequest } from "@/hooks/use-request";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILES = 10;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  pricingType: z.enum(["fixed", "hourly"]),
  pricing: z.coerce.number().min(1, { message: "Price is required" }),
  media: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) =>
        files?.every(
          (file) =>
            file.size <= MAX_FILE_SIZE &&
            ACCEPTED_IMAGE_TYPES.includes(file.type),
        ),
      {
        message: "Invalid file type or size",
      },
    ),
  location: z.string().min(1, { message: "Location is required" }),
  tags: z.array(z.string()),
});

export default function AddService() {
  const [preview, setPreview] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]); // Track selected files
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for hidden input

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    if (files.length + newFiles.length > MAX_FILES) {
      toast({
        variant: "destructive",
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${MAX_FILES} images.`,
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

  const { loading: createServiceLoading, request: createService } =
    useRequest<CreateServiceDTO>(
      (params) => servicesService.createService(params),
      {
        successToast: true,
        successMessage: "Service created successfully",
        successCallback: () => navigate(`/services`),
        errorToast: true,
        errorMessage: "Failed to create service",
      },
    );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const dto: CreateServiceDTO = values;
    createService(dto);
  }

  function openFileDialog() {
    fileInputRef.current?.click(); // Programmatically open the file dialog
  }

  return (
    <RequireAuth>
      <div className="flex flex-grow flex-col gap-2 container my-8">
        <div className="flex flex-col w-full space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Add New Service</h2>
          <Label className="text-muted-foreground">
            Create a new service for your customers to purchase.
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
                    <Input {...field} disabled={createServiceLoading} />
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
                    <Input {...field} disabled={createServiceLoading} />
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
                    <Textarea {...field} disabled={createServiceLoading} />
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
                      <Input
                        type="number"
                        {...field}
                        disabled={createServiceLoading}
                      />
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
                        <SelectTrigger disabled={createServiceLoading}>
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
                        {!createServiceLoading && (
                          <X
                            onClick={() => handleRemoveFile(index)}
                            className={
                              "cursor-pointer absolute bg-destructive m-1 text-white rounded-full top-0 right-0 z-10 w-[1.2rem] h-[1.2rem]"
                            }
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <FormControl>
                    <>
                      <Button
                        type="button"
                        disabled={
                          files.length >= MAX_FILES || createServiceLoading
                        }
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
                        disabled={createServiceLoading}
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
                    <Input {...field} disabled={createServiceLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag(s)</FormLabel>
                  <FormControl>
                    <InputTags {...field} disabled={createServiceLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createServiceLoading}>
              {createServiceLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </RequireAuth>
  );
}
