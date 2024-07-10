import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-grow flex-col justify-center items-center">
      <h1 className="text-4xl font-bold  mb-4">404 - Not Found</h1>
      <Label className="text-lg  mb-8">
        Oops! It seems the page you&apos;re looking for doesn&apos;t exist.
      </Label>
      <Button onClick={() => navigate("/")} className="rounded-full">
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
