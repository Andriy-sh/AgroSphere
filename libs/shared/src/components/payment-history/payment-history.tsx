import React from 'react';

export interface PaymentHistoryItem {
  date: string;
  amount: string;
}

export interface PaymentHistoryProps {
  history: PaymentHistoryItem[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ history }) => (
  <div className="bg-white rounded-xl p-6 shadow flex flex-col h-full pb-8">
    <div className="flex items-center justify-between mb-4">
      <div className="font-semibold text-lg">Payment history</div>
      <button className="text-gray-400 hover:text-gray-600">
        <span className="material-symbols-outlined">download</span>
      </button>
    </div>
    <div className="overflow-y-auto flex-1 pr-2">
      {history.map((item: PaymentHistoryItem) => (
        <div
          key={item.date}
          className="flex items-center justify-between py-2 border-b last:border-b-0"
        >
          <span className="text-sm">{item.date}</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{item.amount}</span>
            <button className="text-basic-black bg-basic-white p-0.5 px-1 rounded-md">
              <span className="material-symbols-outlined text-lg">visibility</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

