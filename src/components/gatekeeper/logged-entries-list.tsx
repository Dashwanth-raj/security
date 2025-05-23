'use client';

import type { VehicleEntry } from '@/lib/types';
import ExitForm from './exit-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Car, Clock, FileText, ShieldAlert, CalendarDays, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';


interface LoggedEntriesListProps {
  entries: VehicleEntry[];
  onLogExit: (entryId: string, occupants: number, exitTime: string) => void;
}

export default function LoggedEntriesList({ entries, onLogExit }: LoggedEntriesListProps) {
  const activeEntries = entries.filter(entry => entry.status === 'entered');

  if (activeEntries.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>No Vehicles Currently Entered</CardTitle>
          <CardDescription>Vehicles that have been granted entry will appear here.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-12 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Currently Parked Vehicles</CardTitle>
        <CardDescription>Manage exit for vehicles currently on premises.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {activeEntries.map((entry, index) => (
              <div key={entry.id}>
                <Card className="bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Car className="mr-3 h-6 w-6 text-primary" /> {entry.licensePlate}
                    </CardTitle>
                    {entry.imagePreviewUrl && (
                       <div className="mt-2 relative w-full max-w-xs h-32 overflow-hidden rounded-md border">
                        <Image src={entry.imagePreviewUrl} alt={`License plate ${entry.licensePlate}`} layout="fill" objectFit="cover" data-ai-hint="vehicle license plate" />
                       </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <FileText className="mr-2 mt-1 h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Purpose:</span> {entry.purpose}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ShieldAlert className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Approved by:</span> {entry.authorityName || 'N/A'}
                      </div>
                    </div>
                    <div className="flex items-center">
                       <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <span className="font-medium text-foreground">Entry Time:</span> {entry.entryTime ? format(new Date(entry.entryTime), 'PPpp') : 'N/A'}
                      </div>
                    </div>
                    <ExitForm entry={entry} onLogExit={onLogExit} />
                  </CardContent>
                </Card>
                {index < activeEntries.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
