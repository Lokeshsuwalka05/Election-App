import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-lg mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-900">Voter Swift Finder</h1>
        <p className="text-lg text-gray-600">
          An easy-to-use tool for finding voter information during elections.
        </p>
        <Button 
          onClick={goToDashboard}
          className="px-6 py-6 text-lg"
        >
          Enter Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Index;