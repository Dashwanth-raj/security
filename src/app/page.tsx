'use client';

import { useState, useEffect } from 'react';
import VehicleEntryForm from '@/components/gatekeeper/vehicle-entry-form';
import LoggedEntriesList from '@/components/gatekeeper/logged-entries-list';
import type { VehicleEntry } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function GateKeeperPage() {
  const [vehicleEntries, setVehicleEntries] = useState<VehicleEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const savedEntries = localStorage.getItem('gatekeeper_vehicleEntries');
      return savedEntries ? JSON.parse(savedEntries) : [];
    }
    return [];
  });

  const [previousPurposes, setPreviousPurposes] = useState<string[]>(() => {
     if (typeof window !== 'undefined') {
      const savedPurposes = localStorage.getItem('gatekeeper_previousPurposes');
      return savedPurposes ? JSON.parse(savedPurposes) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('gatekeeper_vehicleEntries', JSON.stringify(vehicleEntries));
  }, [vehicleEntries]);

  useEffect(() => {
    localStorage.setItem('gatekeeper_previousPurposes', JSON.stringify(previousPurposes));
  }, [previousPurposes]);


  const handleEntryLogged = (newEntry: VehicleEntry) => {
    setVehicleEntries(prevEntries => [newEntry, ...prevEntries]);
    if (newEntry.purpose && !previousPurposes.includes(newEntry.purpose)) {
      setPreviousPurposes(prev => Array.from(new Set([newEntry.purpose, ...prev])).slice(0, 20)); // Keep last 20 unique purposes
    }
  };

  const handleLogExit = (entryId: string, occupants: number, exitTime: string) => {
    setVehicleEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? { ...entry, occupantsOnExit: occupants, exitTime: exitTime, status: 'exited' }
          : entry
      )
    );
  };

  return (
    <div className="space-y-12">
      <VehicleEntryForm onEntryLogged={handleEntryLogged} previousPurposes={previousPurposes} />
      <Separator />
      <LoggedEntriesList entries={vehicleEntries} onLogExit={handleLogExit} />
    </div>
  );
}
