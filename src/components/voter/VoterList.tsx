import type { Voter } from '@/utils/types';
import VoterCard from './VoterCard';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ListFilter, GridIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoterListProps {
  voters: Voter[];
  isLoading?: boolean;
}

const VoterList = ({ voters, isLoading = false }: VoterListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVoters = voters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(voters.length / itemsPerPage);

  // Reset to first page when voters change
  useEffect(() => {
    setCurrentPage(1);
  }, [voters.length]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index} 
              className="h-64 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (voters.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="bg-muted/40 rounded-lg p-10 max-w-md mx-auto">
          <ListFilter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Voters Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastItem, voters.length)}
          </span>{" "}
          of <span className="font-medium">{voters.length}</span> voters
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode('grid')}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none border-0"
              onClick={() => setViewMode('list')}
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>

          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Show 6</SelectItem>
              <SelectItem value="9">Show 9</SelectItem>
              <SelectItem value="12">Show 12</SelectItem>
              <SelectItem value="24">Show 24</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVoters.map((voter) => (
            <VoterCard key={voter.id} voter={voter} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {currentVoters.map((voter) => (
            <VoterCard key={voter.id} voter={voter} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          
          <div className="text-sm">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>
          
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoterList;