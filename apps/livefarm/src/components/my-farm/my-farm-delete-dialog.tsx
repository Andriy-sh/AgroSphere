'use client';

import React from 'react';
import { ConfirmationDialog, Icon } from '@@agrosphere/shared';

interface MyFarmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: 'farm' | 'parcel' | 'zone' | 'location-missing';
}

export function MyFarmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: MyFarmDeleteDialogProps) {
  const getTitle = () => {
    switch (itemType) {
      case 'farm':
        return 'Delete farm';
      case 'parcel':
        return 'Delete parcels&zones';
      case 'zone':
        return 'Delete zone';
      case 'location-missing':
        return 'Location missing';
      default:
        return 'Delete item';
    }
  };

  const getMessage = () => {
    switch (itemType) {
      case 'farm':
        return `Are you sure you want to delete ${itemName}? This action cannot be undone. All related parcels and zones will also be deleted.`;
      case 'parcel':
        return 'Are you sure you want to remove the selected parcels or zones from your farm permanently? This action cannot be undone.';
      case 'zone':
        return `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
      case 'location-missing':
        return `This farm "${itemName}" does not have a location set. Save without it?`;
      default:
        return `Are you sure you want to delete ${itemName}? This action cannot be undone.`;
    }
  };

  const getIcon = () => {
    if (itemType === 'location-missing') {
      return (
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <Icon icon="warning" size="lg" className="text-basic-red" />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <Icon icon="delete" size="lg" className="text-basic-red" />
      </div>
    );
  };

  const getConfirmText = () => {
    return itemType === 'location-missing' ? 'Yes' : 'Delete';
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={getTitle()}
      message={getMessage()}
      confirmText={getConfirmText()}
      cancelText="Cancel"
      icon={getIcon()}
      confirmButtonVariant="danger"
      size="md"
    />
  );
}
