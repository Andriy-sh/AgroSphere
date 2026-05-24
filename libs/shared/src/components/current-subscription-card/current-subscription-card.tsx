import React from 'react';
import { Button } from '../button/button';

export interface CurrentSubscriptionCardProps {
  plan: string;
  price: string;
  period: string;
  startDate: string;
  onCancel?: () => void;
  cancelDisabled?: boolean;
}

export const CurrentSubscriptionCard: React.FC<
  CurrentSubscriptionCardProps
> = ({ plan, price, period, startDate, onCancel, cancelDisabled = false }) => {
  return (
    <div className="rounded-2xl border border-basic-green bg-white overflow-hidden shadow-md w-full">
      <div className="bg-basic-green text-white text-sm font-medium px-8 py-[10px]">
        Current subscription
      </div>
      <div className="flex flex-col md:flex-row p-4 bg-white w-full items-start md:items-center">
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-sm font-bold mb-1">{plan}</div>
          <div className="flex items-end mb-2">
            <span className="text-[28px] font-bold">{price}</span>
            <span className="text-sm text-gray-400 ml-2 pb-1">/{period}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
            <span className="material-symbols-outlined text-sm">
              calendar_month
            </span>
            <span className="font-medium">Started:</span>
            <span className="text-black font-semibold ml-2">{startDate}</span>
          </div>
        </div>
        <div className="flex justify-end w-full ">
          <Button
            className="cursor-wait "
            variant="cancel"
            size="md"
            onClick={onCancel}
            disabled={cancelDisabled}
          >
            Cancel subscription
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrentSubscriptionCard;
