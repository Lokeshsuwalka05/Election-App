import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/Dashboard";
import SearchBar from "@/components/voter/SearchBar";
import VoterList from "@/components/voter/VoterList";
import type { Voter } from "@/utils/types";
import { toast } from "sonner";
import { Search, Bookmark, Users, HelpCircle } from "lucide-react";
import { fetchVotersByName, testDatabaseConnection } from "@/utils/supabaseClient";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Test database connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      const isConnected = await testDatabaseConnection();
      console.log('Database connection status:', isConnected);
      if (!isConnected) {
        toast.error("Database connection failed", {
          description: "Please check your Supabase configuration"
        });
      }
    };
    testConnection();
  }, []);

  // Use React Query for data fetching
  const { data: voters = [], isLoading } = useQuery({
    queryKey: ["voters", searchTerm],
    queryFn: () => fetchVotersByName(searchTerm),
    enabled: Boolean(searchTerm),
    gcTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  // Effect for notifying users about search results
  useEffect(() => {
    if (!searchTerm || !voters) return;
    
    if (voters.length === 0) {
      toast.error("No results found", {
        description: "Try searching with a different name or ID"
      });
    } else if (voters.length > 0) {
      toast.success(`${voters.length} voters found`, {
        description: "Displaying search results"
      });
    }
  }, [voters, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term && !recentSearches.includes(term)) {
      const updatedSearches = [term, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    }
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    // Get recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-3">Voter Swift Finder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quickly find voter information during elections. Search by name, father's name, or voter ID.
          </p>
        </div>

        <div className="mb-10">
          <SearchBar onSearch={handleSearch} />
        </div>

        {!searchTerm && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center hover:bg-primary/10 transition-colors">
                <Search className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Quick Search</h3>
                <p className="text-muted-foreground text-sm">
                  Find voters quickly by name, father's name, or voter ID
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center hover:bg-primary/10 transition-colors">
                <Users className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Voter Details</h3>
                <p className="text-muted-foreground text-sm">
                  View complete voter information including serial number and part number
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center hover:bg-primary/10 transition-colors">
                <HelpCircle className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
                <p className="text-muted-foreground text-sm">
                  Search for voters by typing their name or voter ID above
                </p>
              </div>
            </div>

            {recentSearches.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Recent Searches</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(term)}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(searchTerm || voters.length > 0 || isLoading) && (
          <VoterList voters={voters} isLoading={isLoading} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard