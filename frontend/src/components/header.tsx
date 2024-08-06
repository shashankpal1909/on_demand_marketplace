import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { PopoverArrow, PopoverClose } from "@radix-ui/react-popover";
import { LogOut } from "lucide-react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdClose, MdMenu, MdNotificationsNone } from "react-icons/md";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ModeToggle } from "@/components/mode-toggle";

import { signOut } from "@/features/auth/thunks";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const notifications = useAppSelector(
    (state) => state.notifications.recentNotifications,
  );

  return (
    <header className="bg-opacity-20 backdrop-filter backdrop-blur-lg border-b border-gray-300 dark:border-gray-700">
      <nav className=" mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-4">
        <div className="flex items-center flex-shrink-0 gap-2 mr-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <MdMenu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription asChild>
                  <div className="flex flex-col text-lg space-y-2 font-semibold">
                    <Button variant="outline">
                      <Link to={"/"}>Home</Link>
                    </Button>
                    <Button  variant="outline">
                      <Link to={"/services"}>Services</Link>
                    </Button>
                    <Button  variant="outline">
                      <Link to={"/availability-calendar"}>
                        Availability Calendar
                      </Link>
                    </Button>
                    <Button  variant="outline">
                      <Link to={"/calendar"}>Calendar</Link>
                    </Button>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Link to={"/"}>
            <h1 className="text-2xl font-semibold">On Demand Marketplace</h1>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          {user && (
            <>
              <Dialog>
                <DialogTrigger>
                  <Button variant={"outline"} size={"icon"}>
                    <LogOut className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to logout?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose className="flex md:justify-end justify-center gap-2">
                      <Button type="button">Cancel</Button>
                      <Button
                        type="submit"
                        variant={"outline"}
                        onClick={() => {
                          dispatch(signOut());
                        }}
                      >
                        Confirm
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Popover>
                <PopoverTrigger>
                  <Button variant={"outline"} size={"icon"} onClick={() => {}}>
                    <MdNotificationsNone size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[800px]">
                  <div className="flex items-center justify-between">
                    <Label className="text-xl font-semibold">
                      Notifications
                    </Label>
                    <PopoverClose className="border rounded-full p-1">
                      {/* <Button
                        variant={"outline"}
                        size={"icon"}
                        className="rounded-full"
                      > */}
                      <MdClose />
                      {/* </Button> */}
                    </PopoverClose>
                  </div>
                  {/* <Separator className="my-2" /> */}
                  {/* <Card>
                    <CardHeader>Notifications</CardHeader>
                    <CardContent>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex gap-2">
                          <div>{notification.title}</div>
                          <div>{notification.description}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card> */}
                  {notifications?.map((notification) => (
                    <div className="border rounded-sm p-2 my-2">
                      <div className="text-sm font-semibold">
                        {notification.title}
                      </div>
                      <div className="text-xs text-muted-foreground text-clip">
                        {notification.description}
                      </div>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
