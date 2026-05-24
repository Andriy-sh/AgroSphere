import { useState, useCallback } from 'react';

export type DialogType =
  | 'DELETE'
  | 'DELETE_MULTIPLE'
  | 'EDIT_NAME'
  | 'MOVE_TO'
  | 'GROUP_NAME'
  | null;

interface DeleteDialogData {
  itemId: string;
  itemName: string;
  itemType: 'farm' | 'parcel' | 'zone' | 'location-missing';
}

interface EditDialogData {
  itemId: string;
  currentName: string;
}

interface MoveToDialogData {
  selectedItems: string[];
}

interface GroupNameDialogData {
  selectedItems: string[];
}

interface DeleteMultipleDialogData {
  selectedItems: string[];
}

export type DialogData =
  | { type: 'DELETE'; data: DeleteDialogData }
  | { type: 'DELETE_MULTIPLE'; data: DeleteMultipleDialogData }
  | { type: 'EDIT_NAME'; data: EditDialogData }
  | { type: 'MOVE_TO'; data: MoveToDialogData }
  | { type: 'GROUP_NAME'; data: GroupNameDialogData }
  | null;

export function useFarmDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogData>(null);

  const openDialog = useCallback(
    <T extends DialogType>(
      type: T,
      data: T extends 'DELETE'
        ? DeleteDialogData
        : T extends 'DELETE_MULTIPLE'
        ? DeleteMultipleDialogData
        : T extends 'EDIT_NAME'
        ? EditDialogData
        : T extends 'MOVE_TO'
        ? MoveToDialogData
        : T extends 'GROUP_NAME'
        ? GroupNameDialogData
        : never
    ) => {
      setActiveDialog({ type, data } as DialogData);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
  }, []);

  return {
    activeDialog,
    openDialog,
    closeDialog,
  };
}
