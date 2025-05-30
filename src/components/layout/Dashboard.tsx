import type { ReactNode } from "react";
import Navbar from "./NavBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const DashboardLayout = ({ children, requireAuth = true }: DashboardLayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} VoteSwiftFinder. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;