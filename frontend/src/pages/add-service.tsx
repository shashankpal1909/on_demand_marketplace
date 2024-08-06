import { zodResolver } from "@hookform/resolvers/zod";
import { type ChangeEvent, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import RequireAuth from "@/components/require-auth";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }),
  pricingType: z.enum(["fixed", "hourly"]),
  pricing: z.coerce.number().min(1, { message: "Price is required" }),
  media: z
    .instanceof(FileList)
    .optional()
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;
        return fileList.length <= 10;
      },
      {
        message: "You can only upload up to 10 files",
      },
    )
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;
        for (const file of fileList) {
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }
        return true;
      },
      { message: "Invalid image type" },
    )
    .refine(
      (fileList) => {
        if (!fileList || fileList.length === 0) return true;
        for (const file of fileList) {
          return file.size <= MAX_FILE_SIZE;
        }
        return true;
      },
      {
        message: "Invalid image size",
      },
    ),
  location: z.string().min(1, {
    message: "Location is required",
  }),
  tags: z.preprocess((a) => {
    if (typeof a === "string") return a.split(",");
    else return [];
  }, z.array(z.string())),
});

function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const urls: string[] = [];

  if (!event.target.files) return urls;

  for (let file of event.target.files) {
    if (file.type.startsWith("image")) {
      urls.push(URL.createObjectURL(file));
    }
  }

  return urls;
}

export default function AddService() {
  const [preview, setPreview] = useState<string[]>([]);

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
    },
  });

  const fileRef = form.register("media");
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    servicesService
      .createService(values)
      .then(() => {
        toast({
          title: "Service created successfully",
        });
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
                  {
                    <div className="grid grid-cols-6 gap-1">
                      {preview?.map((url) => (
                        <Dialog key={url}>
                          <DialogTrigger>
                            {/*<div className={"relative"}>*/}
                            <img src={url} width={200} alt="uploaded preview" />
                            {/*<Button*/}
                            {/*  variant={"outline"}*/}
                            {/*  size={"icon"}*/}
                            {/*  className={"absolute top-1 right-1 w-6 h-6"}*/}
                            {/*  onClick={(event) => {*/}
                            {/*    event.preventDefault();*/}
                            {/*    //   delete this image*/}
                            {/*    setPreview((preview) =>*/}
                            {/*      preview.filter((img) => img !== url),*/}
                            {/*    );*/}
                            {/*  }}*/}
                            {/*>*/}
                            {/*  <X className={"w-[1.2rem] h-[1.2rem]"} />*/}
                            {/*</Button>*/}
                            {/*</div>*/}
                          </DialogTrigger>
                          <DialogContent className="lg:max-w-[75%] max-w-full">
                            <DialogHeader>
                              <DialogTitle>Preview</DialogTitle>
                              <DialogDescription
                                className={"flex justify-center"}
                              >
                                <img
                                  src={url}
                                  className={"rounded-md h-[75vh]"}
                                  alt="uploaded preview"
                                />
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  }
                  <FormControl>
                    <Input
                      className="dark:file:text-foreground"
                      type="file"
                      multiple
                      {...fileRef}
                      onChange={(event) => {
                        const urls = getImageData(event);
                        setPreview(urls);
                        fileRef.onChange(event);
                      }}
                    />
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
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </RequireAuth>
  );
}
