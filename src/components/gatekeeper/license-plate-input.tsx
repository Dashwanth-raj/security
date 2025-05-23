'use client';

import { Camera, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface LicensePlateInputProps {
  value: string;
  onChange: (value: string) => void;
  onImageScanned: (imageUrl: string, scannedPlate: string) => void; // Callback for when an image is "scanned"
}

export default function LicensePlateInput({ value, onChange, onImageScanned }: LicensePlateInputProps) {
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraAccessGranted, setCameraAccessGranted] = useState(false);
  const { toast } = useToast();

  const handleScanClick = () => {
    setShowCameraModal(true);
  };

  const handleAllowCamera = () => {
    setCameraAccessGranted(true);
    // Simulate scanning
    toast({
      title: "Camera Access",
      description: "Camera access granted. Simulating scan...",
    });
    setTimeout(() => {
      const dummyPlate = `MH12${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
      const dummyImageUrl = `https://placehold.co/300x200.png`;
      onImageScanned(dummyImageUrl, dummyPlate);
      setShowCameraModal(false);
      setCameraAccessGranted(false); // Reset for next time
       toast({
        title: "Scan Complete",
        description: `License plate ${dummyPlate} captured.`,
      });
    }, 2000);
  };
  
  const handleDenyCamera = () => {
    toast({
      title: "Camera Access Denied",
      description: "Camera access was not granted. Please enter manually.",
      variant: "destructive",
    });
    setShowCameraModal(false);
  }


  return (
    <div className="space-y-2">
      <Label htmlFor="licensePlate">Vehicle Number</Label>
      <div className="flex space-x-2">
        <Input
          id="licensePlate"
          type="text"
          placeholder="e.g., MH12AB1234"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="flex-grow text-lg"
          aria-label="Vehicle Number"
        />
        <AlertDialog open={showCameraModal} onOpenChange={setShowCameraModal}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" onClick={handleScanClick} aria-label="Scan License Plate">
              <Camera className="mr-2 h-5 w-5" />
              Scan
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>License Plate Scan</AlertDialogTitle>
              <AlertDialogDescription>
                { !cameraAccessGranted ? 
                  "This app requires temporary camera access to scan license plates. Your camera view is only active during scanning."
                  : "Simulating camera feed. Please wait..."
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            {cameraAccessGranted && (
                <div className="flex justify-center items-center p-4 my-4 border border-dashed rounded-md min-h-[200px] bg-muted">
                    <ScanLine className="h-16 w-16 text-primary animate-pulse" />
                </div>
            )}
            <AlertDialogFooter>
              {!cameraAccessGranted ? (
                <>
                  <AlertDialogCancel onClick={handleDenyCamera}>Deny</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAllowCamera} className="bg-accent hover:bg-accent/90">Allow Camera</AlertDialogAction>
                </>
              ) : (
                 <AlertDialogCancel onClick={() => { /* Close if needed, or disable */ }}>Scanning...</AlertDialogCancel>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="text-xs text-muted-foreground">
        Enter manually or use camera scan (requires permission).
      </p>
    </div>
  );
}
