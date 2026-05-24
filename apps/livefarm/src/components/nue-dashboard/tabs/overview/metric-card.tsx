'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-basic-gray-light p-5 h-full flex flex-col items-center justify-center text-center">
      <h3 className="text-sm font-medium text-basic-gray mb-3">{title}</h3>
      <div className="text-3xl font-bold text-basic-black mb-2">{value}</div>
      <p className="text-xs text-basic-gray font-normal">{description}</p>
    </div>
  );
}
