import { useCallback, useState } from 'react';

type NavigationDirection = 'prev' | 'next';

interface UseParcelNavigationProps {
  hasChanges: boolean;
  totalParcels: number;
  activeIndex: number;
  onNavigate: (direction: NavigationDirection) => void;
  onDiscardChanges: () => void;
}

interface UseParcelNavigationReturn {
  handlePrev: () => void;
  handleNext: () => void;
  showUnsavedChangesDialog: boolean;
  pendingNavigation: NavigationDirection | null;
  handleConfirmNavigation: () => void;
  handleCancelNavigation: () => void;
}

export function useParcelNavigation({
  hasChanges,
  totalParcels,
  activeIndex,
  onNavigate,
  onDiscardChanges,
}: UseParcelNavigationProps): UseParcelNavigationReturn {
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] =
    useState(false);
  const [pendingNavigation, setPendingNavigation] =
    useState<NavigationDirection | null>(null);

  const handlePrev = useCallback(() => {

    if (activeIndex === 0) {
      console.log('[useParcelNavigation] handlePrev: already at first parcel');
      return;
    }

    if (hasChanges) {
      setPendingNavigation('prev');
      setShowUnsavedChangesDialog(true);
      return;
    }

    onNavigate('prev');
  }, [hasChanges, activeIndex, onNavigate]);

  const handleNext = useCallback(() => {

    if (activeIndex >= totalParcels - 1) {
      console.log('[useParcelNavigation] handleNext: already at last parcel');
      return;
    }

    if (hasChanges) {
      setPendingNavigation('next');
      setShowUnsavedChangesDialog(true);
      return;
    }

    onNavigate('next');
  }, [hasChanges, activeIndex, totalParcels, onNavigate]);

  const handleConfirmNavigation = useCallback(() => {

    onDiscardChanges();

    if (pendingNavigation) {
      onNavigate(pendingNavigation);
    }

    setShowUnsavedChangesDialog(false);
    setPendingNavigation(null);
  }, [pendingNavigation, onNavigate, onDiscardChanges]);

  const handleCancelNavigation = useCallback(() => {
    setShowUnsavedChangesDialog(false);
    setPendingNavigation(null);
  }, []);

  return {
    handlePrev,
    handleNext,
    showUnsavedChangesDialog,
    pendingNavigation,
    handleConfirmNavigation,
    handleCancelNavigation,
  };
}
