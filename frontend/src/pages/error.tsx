import { useNavigate, useRouteError } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function RootErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError() as Error;

  return (
    <div className="flex flex-grow flex-col justify-center items-center">
      <h1 className="text-4xl font-bold  mb-4">
        Uh oh, something went terribly wrong 😩
      </h1>
      <Label className="text-lg mt-4 mb-8">
        <pre className="text-sm">{error.message || JSON.stringify(error)}</pre>
      </Label>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/")} className="rounded-full">
          Report
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="rounded-full"
          variant={"outline"}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
