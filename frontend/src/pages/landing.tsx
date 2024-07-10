import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

function LandingPage() {
  return (
    <div className="flex flex-grow justify-center items-center">
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Welcome to{" "}
            <span className="text-primary">On Demand Marketplace!</span>
          </h1>
          <div className="text-justify my-8">
            This is a demo application showcasing a simple marketplace built
            with React, Redux, and Material-UI.
          </div>
          <div className="flex gap-4 justify-center mb-8">
            <Button asChild className="rounded-full">
              <Link to={"/sign-up"}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
