'use client';

import React from 'react';

interface InviteOrgField {
  value: string;
  placeholder: string;
}

interface InviteOrganisationCardProps {
  fields: InviteOrgField[];
}

export const InviteOrganisationCard: React.FC<InviteOrganisationCardProps> = ({
  fields,
}) => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-xl">
          business_center
        </span>
        <span className="font-semibold text-xl text-[#101010]">
          Invite organisation
        </span>
      </div>
      <button className="text-[#818D99]">
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>
    </div>
    <div className="flex flex-col gap-2 mb-4">
      {fields.map((field, idx) => (
        <div key={idx} className="flex gap-2 justify-between flex-col">
          <label className="block text-[#818D99] text-xs !m-0">Email</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="email"
              value={field.value}
              placeholder={field.placeholder}
              readOnly
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-base font-medium text-[#101010] focus:outline-none bg-gray-50"
            />
            <button
              type="button"
              className="bg-basic-white rounded-lg w-9 h-9 flex items-center justify-center"
            >
              <span className="material-symbols-outlined !text-xl text-[#101010]">
                delete
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
    <button
      type="button"
      className="flex items-center gap-2 text-[#29B54C] font-medium text-base mb-6"
    >
      <span className="material-symbols-outlined text-sm !text-[#29B54C]">
        add_circle
      </span>
      Add more organisation
    </button>
    <button
      type="button"
      className="w-full bg-[#29B54C] !text-white font-medium text-sm rounded-xl py-2 mt-1"
    >
      Send invite
    </button>
  </>
);
