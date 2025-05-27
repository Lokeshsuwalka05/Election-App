import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="inline-block bg-primary text-white rounded-full p-3 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-8 w-8"
          >
            <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/>
            <path d="M3 16.2V21m0 0h4.8M3 21l6-6"/>
            <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6"/>
            <path d="M3 7.8V3m0 0h4.8M3 3l6 6"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">VoteSwiftFinder</h1>
        <p className="text-gray-600">Find voter information quickly during elections</p>
      </div>
      <LoginForm />
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>For demo purposes, enter any username and password</p>
      </div>
    </div>
  );
};

export default Login;