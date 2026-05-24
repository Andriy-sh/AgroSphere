'use client';

import React from 'react';
import { MyFarmDeleteDialog } from '../my-farm-delete-dialog';
import { MyFarmDeleteMultipleDialog } from '../my-farm-delete-multiple-dialog';
import { MyFarmEditDialog } from '../my-farm-edit-dialog';
import { MyFarmMoveToDialog } from '../my-farm-move-to-dialog';
import { MyFarmGroupNameDialog } from '../my-farm-group-name';
import type { FarmItem } from '@@agrosphere/shared';
import type { DialogData } from '../hooks/use-farm-dialogs';

interface MyFarmDialogsProps {
  activeDialog: DialogData;
  farmItems: FarmItem[];
  onClose: () => void;
  onDeleteConfirm: (itemId: string) => Promise<void>;
  onEditSave: (itemId: string, newName: string) => Promise<void>;
  onMoveToConfirm: (itemIds: string[], targetFarmId: string) => Promise<void>;
  onDeleteMultipleConfirm: (itemIds: string[]) => Promise<void>;
  onGroupNameSave: (itemIds: string[], groupName: string) => Promise<void>;
}

export function MyFarmDialogs({
  activeDialog,
  farmItems,
  onClose,
  onDeleteConfirm,
  onEditSave,
  onMoveToConfirm,
  onDeleteMultipleConfirm,
  onGroupNameSave,
}: MyFarmDialogsProps) {
  if (!activeDialog) {
    return null;
  }

  const { type, data } = activeDialog;

  return (
    <>
      {type === 'DELETE' && (
        <MyFarmDeleteDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={() => onDeleteConfirm(data.itemId)}
          itemName={data.itemName}
          itemType={data.itemType}
        />
      )}

      {type === 'EDIT_NAME' && (
        <MyFarmEditDialog
          isOpen={true}
          onClose={onClose}
          onSave={(newName) => onEditSave(data.itemId, newName)}
          currentName={data.currentName}
          farmId={data.itemId}
        />
      )}

      {type === 'MOVE_TO' && (
        <MyFarmMoveToDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={(targetFarmId) =>
            onMoveToConfirm(data.selectedItems, targetFarmId)
          }
          selectedCount={data.selectedItems.length}
          availableFarms={farmItems.map((farm) => ({
            id: farm.id,
            name: farm.name,
          }))}
        />
      )}

      {type === 'DELETE_MULTIPLE' && (
        <MyFarmDeleteMultipleDialog
          isOpen={true}
          onClose={onClose}
          onConfirm={() => onDeleteMultipleConfirm(data.selectedItems)}
          count={data.selectedItems.length}
        />
      )}

      {type === 'GROUP_NAME' && (
        <MyFarmGroupNameDialog
          isOpen={true}
          onClose={onClose}
          onSave={(groupName) => onGroupNameSave(data.selectedItems, groupName)}
          defaultName="Group"
        />
      )}
    </>
  );
}
