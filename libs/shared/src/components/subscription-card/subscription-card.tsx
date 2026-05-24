import React from 'react';
import { Button } from '../button/button';
import { Badge } from '../badge/badge';
import { Collapsible } from '../collapsible/collapsible';
import { Radio } from '../radio/radio';
import { cn } from '../../utils/cn';

export interface SubscriptionCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText?: string;
  onButtonClick?: () => void;
  disabled?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  showVat?: boolean;
  vatText?: string;
  collapsible?: boolean;
  popular?: boolean;
  recommended?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  period,
  features,
  buttonText,
  onButtonClick,
  disabled = false,
  selectable = false,
  selected = false,
  onSelect,
  showVat = false,
  vatText = '+VAT',
  collapsible = false,
  popular = false,
  recommended = false,
}) => {
  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect();
    }
  };

  const renderFeature = (feature: string, idx: number) => (
    <div key={idx} className="flex items-center gap-2">
      <Badge
        variant="default"
        size="xs"
        className="w-4 h-4 p-0 bg-basic-green border-basic-green flex items-center justify-center"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Badge>
      <span className="text-basic-black text-sm font-medium">{feature}</span>
    </div>
  );

  return (
    <div
      className={cn(
        'rounded-xl border p-5  shadow-md flex flex-col items-center w-full  transition-all hover:shadow-lg h-full cursor-pointer',
        selectable
          ? selected
            ? 'border-basic-green bg-[#EEF0F652]'
            : 'border-basic-white bg-[#EEF0F652]'
          : 'border-basic-white bg-[#EEF0F652]'
      )}
      onClick={handleCardClick}
    >
      <div className="flex flex-col w-full flex-1 mb-4">
        <div className="flex items-center justify-between mb-2 w-full">
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold text-left">{title}</div>
            {popular && (
              <Badge
                variant="default"
                size="xs"
                className="bg-[#00AF4D1F]  text-basic-green text-xs px-2 py-1 rounded-sm"
              >
                Best value
              </Badge>
            )}
            {recommended && (
              <Badge
                variant="default"
                size="xs"
                className="bg-blue-500 text-white text-xs px-2 py-1"
              >
                Recommended
              </Badge>
            )}
          </div>
          {selectable && (
            <Radio
              name={`subscription-${title.toLowerCase()}`}
              options={[{ value: title, label: '' }]}
              value={selected ? title : ''}
              onChange={() => {
                if (onSelect) onSelect();
              }}
              className="!mb-0"
            />
          )}
        </div>

        <div className="flex items-end mb-1 w-full text-left">
          <span className="text-[28px] font-bold">{price}</span>
          <div className="flex ml-2 pb-1 gap-1">
            {showVat && (
              <span className="text-sm text-basic-black">{vatText}</span>
            )}
            <span className="text-sm text-basic-gray">/ {period}</span>
          </div>
        </div>

        <hr className="w-full my-2 border-basic-gray-light" />

        <div className="w-full ">
          {collapsible ? (
            <Collapsible
              title="Features"
              defaultOpen={true}
              showArrow={true}
              className="bg-transparent border-none shadow-none "
            >
              {features.map((feature, idx) => renderFeature(feature, idx))}
            </Collapsible>
          ) : (
            <div>
              <div className="mb-3">
                <span className="text-sm font-bold">Features</span>
              </div>
              <ul className="w-full flex flex-col gap-3">
                {features.map((feature, idx) => (
                  <li key={idx}>{renderFeature(feature, idx)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {buttonText && (
        <div className="w-full mt-auto">
          <Button
            variant={disabled ? 'cancel' : 'complete'}
            size="default"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              if (onButtonClick) onButtonClick();
            }}
            disabled={disabled}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
