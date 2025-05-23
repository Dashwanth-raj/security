'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle2, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import type { Authority } from '@/lib/types';
import { authorities as defaultAuthorities } from '@/lib/data'; // Mock data
import { useToast } from '@/hooks/use-toast';

interface AuthoritySelectorProps {
  selectedAuthorityId?: string;
  onAuthoritySelected: (authorityId?: string, authorityName?: string) => void;
  onApprovalLogged: () => void;
  isApproved: boolean;
  contactStatus: 'idle' | 'contacted' | 'approved';
  onContactStatusChange: (status: 'idle' | 'contacted' | 'approved') => void;
}

export default function AuthoritySelector({
  selectedAuthorityId,
  onAuthoritySelected,
  onApprovalLogged,
  isApproved,
  contactStatus,
  onContactStatusChange,
}: AuthoritySelectorProps) {
  const { toast } = useToast();
  const authoritiesList = defaultAuthorities;

  const selectedAuthorityDetails = authoritiesList.find(auth => auth.id === selectedAuthorityId);

  const handleContactAuthority = () => {
    if (!selectedAuthorityId) {
      toast({
        title: 'No Authority Selected',
        description: 'Please select an authority to contact.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: `Contacting ${selectedAuthorityDetails?.name}`,
      description: `Simulating call to ${selectedAuthorityDetails?.contact}. Please confirm approval once received.`,
    });
    onContactStatusChange('contacted');
  };

  const handleLogApproval = () => {
    if (!selectedAuthorityId) {
       toast({
        title: 'Cannot Log Approval',
        description: 'Please select an authority first.',
        variant: 'destructive',
      });
      return;
    }
    if (contactStatus !== 'contacted') {
      toast({
        title: 'Cannot Log Approval',
        description: 'Please contact the authority first.',
        variant: 'destructive',
      });
      return;
    }
    onApprovalLogged();
    onContactStatusChange('approved');
    toast({
      title: 'Approval Logged',
      description: `Entry approved by ${selectedAuthorityDetails?.name}.`,
      className: 'bg-green-500 text-white',
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="authority">Authority to Contact</Label>
        <Select
          value={selectedAuthorityId}
          onValueChange={(value) => {
            const authority = authoritiesList.find(a => a.id === value);
            onAuthoritySelected(value, authority?.name);
            if (contactStatus !== 'idle' && !isApproved) { // Reset contact status if authority changes and not yet approved
                onContactStatusChange('idle');
            }
          }}
          disabled={isApproved}
        >
          <SelectTrigger id="authority" aria-label="Select Authority">
            <SelectValue placeholder="Select authority..." />
          </SelectTrigger>
          <SelectContent>
            {authoritiesList.map((auth) => (
              <SelectItem key={auth.id} value={auth.id}>
                {auth.name} ({auth.contact})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAuthorityId && !isApproved && (
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleContactAuthority}
            disabled={contactStatus === 'contacted' || contactStatus === 'approved'}
            className="flex-1"
          >
            <Phone className="mr-2 h-4 w-4" />
            Contact Authority
          </Button>
          <Button
            onClick={handleLogApproval}
            disabled={contactStatus !== 'contacted' || contactStatus === 'approved'}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Log Verbal Approval
          </Button>
        </div>
      )}

      {selectedAuthorityId && (
        <div className="p-3 rounded-md border text-sm">
          {contactStatus === 'idle' && !isApproved && (
            <div className="flex items-center text-muted-foreground">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              <span>Approval pending. Please contact the selected authority.</span>
            </div>
          )}
          {contactStatus === 'contacted' && !isApproved && (
            <div className="flex items-center text-orange-600">
              <Clock className="mr-2 h-5 w-5 animate-pulse" />
              <span>Awaiting verbal approval from {selectedAuthorityDetails?.name}.</span>
            </div>
          )}
          {(contactStatus === 'approved' || isApproved) && (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              <span>Entry approved by {selectedAuthorityDetails?.name}.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
