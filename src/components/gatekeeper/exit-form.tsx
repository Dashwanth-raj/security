'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Users } from 'lucide-react';
import type { VehicleEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ExitFormProps {
  entry: VehicleEntry;
  onLogExit: (entryId: string, occupants: number, exitTime: string) => void;
}

export default function ExitForm({ entry, onLogExit }: ExitFormProps) {
  const [occupants, setOccupants] = useState<string>('');
  const { toast } = useToast();

  const handleLogExit = () => {
    const numOccupants = parseInt(occupants, 10);
    if (isNaN(numOccupants) || numOccupants < 0) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid number of occupants.',
        variant: 'destructive',
      });
      return;
    }
    const exitTime = new Date().toISOString();
    onLogExit(entry.id, numOccupants, exitTime);
    toast({
      title: 'Exit Logged',
      description: `Vehicle ${entry.licensePlate} exited with ${numOccupants} occupant(s).`,
      className: 'bg-primary text-primary-foreground'
    });
  };

  return (
    <div className="mt-4 p-4 border-t border-border space-y-3">
      <h4 className="text-md font-semibold text-foreground">Log Exit for {entry.licensePlate}</h4>
      <div className="space-y-1">
        <Label htmlFor={`occupants-${entry.id}`}>Number of Occupants on Exit</Label>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <Input
            id={`occupants-${entry.id}`}
            type="number"
            min="0"
            placeholder="e.g., 2"
            value={occupants}
            onChange={(e) => setOccupants(e.target.value)}
            className="w-full sm:w-auto"
            aria-label="Number of occupants on exit"
          />
        </div>
      </div>
      <Button onClick={handleLogExit} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
        <LogOut className="mr-2 h-4 w-4" />
        Confirm Exit & Time-stamp
      </Button>
    </div>
  );
}
