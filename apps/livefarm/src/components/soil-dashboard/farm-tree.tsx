'use client';

import { useState, useMemo, useEffect } from 'react';
import { Icon } from '@@agrosphere/shared';
import {
  getFarms,
  type Farm,
  type Parcel,
  type Zone,
  type SelectedEntity,
  getEntityType,
  getEntityName,
} from '../../data/soildashboard-data';

interface TreeNode {
  id: string;
  label: string;
  type?: string;
  date?: string;
  children?: TreeNode[];
  isGroup?: boolean;
}

function getCurrentDate(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function generateParcelPrefix(
  farmIndex: number,
  parcelIndex: number
): string {
  const farmNumber = farmIndex + 1;
  const parcelLetter = String.fromCharCode(65 + parcelIndex);
  return `${farmNumber}${parcelLetter}`;
}

function convertFarmToTreeNode(farmData: Farm, farmIndex: number): TreeNode {
  const currentDate = getCurrentDate();

  const zoneToTreeNode = (zone: Zone, index: number): TreeNode => ({
    id: zone.id,
    label: zone.name,
    date: currentDate,
  });

  const parcelToTreeNode = (parcel: Parcel, index: number): TreeNode => {
    const parcelPrefix = generateParcelPrefix(farmIndex, index);
    const hasZones = parcel.zones && parcel.zones.length > 0;

    return {
      id: parcel.id,
      label: parcel.name,
      type: parcelPrefix,
      date: currentDate,
      children: hasZones
        ? parcel.zones.map((zone, zoneIndex) => zoneToTreeNode(zone, zoneIndex))
        : undefined,
    };
  };

  return {
    id: farmData.id,
    label: farmData.name,
    children: farmData.parcels.map((parcel, index) =>
      parcelToTreeNode(parcel, index)
    ),
  };
}

function TreeItem({
  node,
  level = 0,
  isFirst = false,
  isLast = false,
  selectedId,
  onSelect,
}: {
  node: TreeNode;
  level?: number;
  isFirst?: boolean;
  isLast?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(
    getFarms().some((f) => f.id === node.id)
  );
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  const getDateColor = (date?: string) => {
    if (!date) return '';
    if (date === '11/07/21' || date === '20/05/21') return 'text-red-500';
    return 'text-gray-400';
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleItemClick = () => {
    if (onSelect) {
      onSelect(node.id);
    }
  };

  return (
    <div>
      {level === 0 && !isFirst && (
        <div className="border-t border-basic-white my-2 mx-[30px]" />
      )}
      <div
        className={`flex items-center justify-between py-0.5 rounded-lg px-2 transition-colors duration-200 cursor-pointer ${
          isSelected ? 'bg-[#00AF4D1F] text-basic-green' : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleItemClick}
      >
        <div className="flex items-center flex-1">
          {hasChildren && (
            <div
              className="w-6 h-6 flex justify-center items-center cursor-pointer rounded hover:bg-gray-200 transition-colors duration-200 p-1 m-1"
              onClick={handleArrowClick}
            >
              {isExpanded ? (
                <Icon icon="arrow_right" className="rotate-90" />
              ) : (
                <Icon icon="arrow_right" />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-6 h-6 m-1" />}
          {node.isGroup && <Icon icon="stack" className="mx-2" />}
          <div className="flex items-center gap-2">
            {node.type && <span className="text-basic-gray ">{node.type}</span>}
            <span className="text-sm">{node.label}</span>
          </div>
        </div>
        {node.date && (
          <span
            className={`text-xs ${getDateColor(node.date)} flex-shrink-0 ml-2`}
          >
            {node.date}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="gap-1 flex flex-col mt-1">
          {node.children?.map((child, index) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              isFirst={index === 0}
              isLast={index === (node.children?.length || 0) - 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FarmTreeProps {
  selectedEntity: SelectedEntity | null;
  onSelect: (entity: SelectedEntity | null) => void;
}

export default function FarmTree({ selectedEntity, onSelect }: FarmTreeProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh when component mounts or when data might have changed
  useEffect(() => {
    // Initial refresh
    setRefreshKey((prev) => prev + 1);

    // Check again after delays to catch async loaded data
    const timer1 = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 100);

    const timer2 = setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const farmData = useMemo(() => {
    return getFarms().map((farmItem, index) =>
      convertFarmToTreeNode(farmItem, index)
    );
  }, [refreshKey]);

  const handleSelect = (id: string) => {
    const entityType = getEntityType(id);
    const entityName = getEntityName(id);

    if (entityType && entityName) {
      onSelect({
        type: entityType,
        id,
        name: entityName,
      } as SelectedEntity);
    } else {
      onSelect(null);
    }
  };

  const handleAllFarmsClick = () => {
    onSelect(null);
  };

  return (
    <div className="flex flex-col h-full w-[20%] border border-basic-gray-light rounded-xl bg-white overflow-y-auto p-5 gap-2">
      <div
        className={`flex items-center justify-between py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
          selectedEntity === null
            ? 'bg-[#00AF4D1F]'
            : 'bg-gray-50 hover:bg-gray-100'
        }`}
        onClick={handleAllFarmsClick}
      >
        <span
          className={`text-sm mx-2 font-medium ${
            selectedEntity === null ? 'text-basic-green' : 'text-gray-700'
          }`}
        >
          All farms
        </span>
      </div>

      {farmData.map((node, index) => (
        <TreeItem
          key={node.id}
          node={node}
          isFirst={index === 0}
          selectedId={selectedEntity?.id || null}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
