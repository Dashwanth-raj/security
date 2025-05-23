export interface Authority {
  id: string;
  name: string;
  contact: string; 
}

export type VehicleEntryStatus = 'pending_approval' | 'awaiting_approval' | 'entered' | 'exited';

export interface VehicleEntry {
  id: string;
  licensePlate: string;
  purpose: string;
  authorityId?: string;
  authorityName?: string; // Denormalized for display
  entryTime?: string; // ISO string
  exitTime?: string; // ISO string
  occupantsOnExit?: number;
  status: VehicleEntryStatus;
  imagePreviewUrl?: string; // For camera scan preview
}

export interface PurposeSuggestion {
  id: string;
  text: string;
}
