import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Voter } from '@/utils/types';
import { User, Home, Calendar, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VoterCardProps {
  voter: Voter;
}

const VoterCard = ({ voter }: VoterCardProps) => {
  return (
    <Link to={`/voter/${voter.id}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <Badge variant="outline" className="bg-primary/10 text-primary font-semibold">
              Serial #{voter.serialNumber}
            </Badge>
            {/* <Badge variant="outline" className="bg-secondary text-secondary-foreground">
              Part {voter.partNumber}
            </Badge> */}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <UserCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-lg">{voter.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Father's Name</p>
                <p className="font-medium">{voter.fatherName}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Home className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">House Number</p>
                <p className="font-medium">{voter.houseNumber}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Age & Gender</p>
                <p className="font-medium">{voter.age} years, {voter.gender}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-dashed">
            <p className="text-xs text-muted-foreground">Voter ID</p>
            <p className="font-mono font-semibold text-sm">{voter.id}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VoterCard;