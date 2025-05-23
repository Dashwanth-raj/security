'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LicensePlateInput from './license-plate-input';
import PurposeInput from './purpose-input';
import AuthoritySelector from './authority-selector';
import type { VehicleEntry, Authority, VehicleEntryStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { LogIn, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface VehicleEntryFormProps {
  onEntryLogged: (newEntry: VehicleEntry) => void;
  previousPurposes: string[];
}

const initialFormState = {
  licensePlate: '',
  purpose: '',
  authorityId: undefined as string | undefined,
  authorityName: undefined as string | undefined,
  imagePreviewUrl: undefined as string | undefined,
};

export default function VehicleEntryForm({ onEntryLogged, previousPurposes }: VehicleEntryFormProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [isApproved, setIsApproved] = useState(false);
  const [contactStatus, setContactStatus] = useState<'idle' | 'contacted' | 'approved'>('idle');
  const { toast } = useToast();

  const handleInputChange = (field: keyof typeof initialFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageScanned = (imageUrl: string, scannedPlate: string) => {
    setFormData(prev => ({ ...prev, licensePlate: scannedPlate, imagePreviewUrl: imageUrl }));
  };

  const handleAuthoritySelected = (authorityId?: string, authorityName?: string) => {
    setFormData(prev => ({ ...prev, authorityId, authorityName }));
    // If authority changes, approval status should reset unless it was already final
    if (!isApproved && contactStatus !== 'idle') {
        setContactStatus('idle');
    }
  };

  const handleApprovalLogged = () => {
    setIsApproved(true);
    setContactStatus('approved');
  };
  
  const handleContactStatusChange = (status: 'idle' | 'contacted' | 'approved') => {
    setContactStatus(status);
    if (status === 'approved') setIsApproved(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.licensePlate || !formData.purpose) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in License Plate and Purpose.',
        variant: 'destructive',
      });
      return;
    }
    if (!isApproved || !formData.authorityId) {
      toast({
        title: 'Approval Required',
        description: 'Please select an authority and log approval.',
        variant: 'destructive',
      });
      return;
    }

    const newEntry: VehicleEntry = {
      id: crypto.randomUUID(),
      licensePlate: formData.licensePlate,
      purpose: formData.purpose,
      authorityId: formData.authorityId,
      authorityName: formData.authorityName,
      entryTime: new Date().toISOString(),
      status: 'entered',
      imagePreviewUrl: formData.imagePreviewUrl,
    };
    onEntryLogged(newEntry);
    toast({
      title: 'Entry Logged Successfully!',
      description: `${formData.licensePlate} has been logged.`,
      className: 'bg-primary text-primary-foreground'
    });
    resetForm();
  };
  
  const resetForm = () => {
    setFormData(initialFormState);
    setIsApproved(false);
    setContactStatus('idle');
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">New Vehicle Entry</CardTitle>
        <CardDescription>Log details for vehicles entering the premises.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <LicensePlateInput
            value={formData.licensePlate}
            onChange={(val) => handleInputChange('licensePlate', val)}
            onImageScanned={handleImageScanned}
          />
          {formData.imagePreviewUrl && (
            <div className="mt-2">
              <Label>Scanned Image Preview:</Label>
              <div className="relative w-full max-w-xs h-32 overflow-hidden rounded-md border mt-1">
                 <Image src={formData.imagePreviewUrl} alt="License plate scan preview" layout="fill" objectFit="cover" data-ai-hint="vehicle license plate" />
              </div>
            </div>
          )}
          <PurposeInput
            value={formData.purpose}
            onChange={(val) => handleInputChange('purpose', val)}
            previousPurposes={previousPurposes}
          />
          <AuthoritySelector
            selectedAuthorityId={formData.authorityId}
            onAuthoritySelected={handleAuthoritySelected}
            onApprovalLogged={handleApprovalLogged}
            isApproved={isApproved}
            contactStatus={contactStatus}
            onContactStatusChange={handleContactStatusChange}
          />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
           <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset Form
          </Button>
          <Button type="submit" disabled={!isApproved} className="w-full sm:w-auto text-base py-3 px-6 bg-primary hover:bg-primary/90">
            <LogIn className="mr-2 h-5 w-5" /> Log Vehicle Entry
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
