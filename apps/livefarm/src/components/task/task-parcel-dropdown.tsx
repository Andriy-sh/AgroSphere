import { Tooltip } from '@base-ui-components/react';
import { DropdownActionsNoLib, Icon } from '@@agrosphere/shared';
import { useEffect, useRef, useState } from 'react';
const dropdownItemStyles =
  'px-1.5 py-1.5 rounded-lg text-sm hover:bg-gray-50 cursor-pointer flex items-center justify-between';

const parcelDropdownItems = [
  {
    id: 'unassigned',
    label: (
      <div className="flex items-center justify-between w-full">
        <span className="text-sm">Unassigned</span>
        <Tooltip.Provider delay={100}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Icon
                onClick={(e) => e.stopPropagation()}
                icon="info"
                size="sm"
                className=" text-basic-gray text-lg hover:text-basic-green transition-colors cursor-pointer"
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner
                className="z-[99999]"
                sideOffset={20}
                side="right"
              >
                <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[99999]">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="info"
                        size="sm"
                        className=" text-basic-black flex items-center justify-center text-lg"
                      />
                      <div className="font-semibold">Unassigned</div>
                    </div>
                    <div className="font-normal text-sm text-basic-black">
                      Show samples that are not assigned to any parcel
                    </div>
                  </div>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    ),
    onClick: () => {
      return;
    },
    className: dropdownItemStyles,
  },
  {
    id: 'all',
    label: (
      <div className="flex items-center justify-between w-full">
        <span className="text-sm">All</span>
        <Tooltip.Provider delay={100}>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Icon
                className=" text-basic-gray text-lg hover:text-basic-green transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                icon="info"
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Positioner
                className="z-[11]"
                sideOffset={20}
                side="right"
              >
                <Tooltip.Popup className="bg-white text-basic-black px-4 py-3 rounded-2xl border border-basic-white max-w-xs z-[99999]">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="info"
                        size="sm"
                        className=" text-basic-black flex items-center justify-center text-lg"
                      />
                      <div className="font-semibold">All</div>
                    </div>
                    <div className="font-normal text-sm text-basic-black">
                      Show all samples regardless of parcel assignment
                    </div>
                  </div>
                </Tooltip.Popup>
              </Tooltip.Positioner>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    ),
    onClick: () => {
      return;
    },
    className: dropdownItemStyles,
  },
];

export const ParcelDropdown: React.FC<{ selectedParcel?: string }> = ({
  selectedParcel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'aria-expanded'
        ) {
          const target = mutation.target as HTMLElement;
          setIsOpen(target.getAttribute('aria-expanded') === 'true');
        }
      });
    });

    if (dropdownRef.current) {
      const button = dropdownRef.current.querySelector('button');
      if (button) {
        observer.observe(button, {
          attributes: true,
          attributeFilter: ['aria-expanded'],
        });
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <DropdownActionsNoLib
        items={parcelDropdownItems}
        placement="bottom-start"
        contentClassName="min-w-[155px] "
        triggerIcon={
          <button
            type="button"
            className={`flex items-center gap-2 px-3 rounded-lg border border-basic-white text-basic-black focus:outline-none transition-colors  ${
              isOpen
                ? 'bg-white hover:bg-gray-50 '
                : 'bg-none hover:bg-none hover:border-basic-white'
            }`}
          >
            <span className="text-sm font-medium">
              {selectedParcel === 'unassigned'
                ? 'Unassigned'
                : selectedParcel === 'all'
                ? 'All'
                : 'Assign parcel'}
            </span>
            <div className="w-px h-9 bg-basic-white"></div>
            <Icon icon="expand_all" size="sm" />
          </button>
        }
      />
    </div>
  );
};
