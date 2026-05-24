'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { cn, Icon, Map, SplitCard } from '@@agrosphere/shared';
import { DateTimePicker } from '@@agrosphere/shared';

export interface WeatherHour {
  id: string;
  time: string;
  temperature: number;
  icon: string;
  isNow?: boolean;
}

export interface WeatherData {
  city: string;
  country: string;
  currentTemp: number;
  description: string;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  clouds: number;
  windSpeed: number;
  sunrise: string;
  windDirection: number;
  sunset: string;
  hourlyForecast: WeatherHour[];
  weatherIcon?: string;
}

export interface TodaysWeatherProps {
  weather: WeatherData;
  className?: string;
  datePickerWidth?: 'auto' | 'full' | 'fixed';
}

interface WeatherDetailItemProps {
  label: string;
  value: string | number;
  unit?: string;
}

function WeatherDetailItem({ label, value, unit }: WeatherDetailItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-basic-gray">{label}</span>
      <span>
        {value}
        {unit && <span className="text-basic-black">{unit}</span>}
      </span>
    </div>
  );
}

export function TodaysWeather({
  weather,
  className,
  datePickerWidth = 'auto',
}: TodaysWeatherProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };

  const weatherDetails = [
    { label: 'Feels like:', value: weather.feelsLike, unit: '°C' },
    { label: 'Humidity:', value: weather.humidity, unit: '%' },
    { label: 'Precipitation:', value: weather.precipitation, unit: ' mm' },
    { label: 'Clouds:', value: weather.clouds, unit: '%' },
    { label: 'Wind speed:', value: weather.windSpeed, unit: ' m/s' },
    { label: 'Sunrise:', value: weather.sunrise },
    { label: 'Wind direction:', value: weather.windDirection },
    { label: 'Sunset:', value: weather.sunset },
  ];

  return (
    <SplitCard
      className={cn('w-full min-h-[475px] text-basic-black', className)}
      topContent={
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Today&apos;s weather</h2>
          <div className="w-96">
            <DateTimePicker
              value={dayjs(selectedDate).toDate()}
              onChange={(newValue) =>
                setSelectedDate(newValue?.toISOString().split('T')[0] || '')
              }
              className="w-full"
              triggerClassName="py-0"
            />
          </div>
        </div>
      }
      bottomContent={
        <div className="space-y-6 text-basic-black">
          <div className="grid grid-cols-11 gap-6">
            <div className="col-span-4 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {weather.weatherIcon && <Icon icon={weather.weatherIcon} />}
                  <span className="text-3xl font-bold">
                    {weather.currentTemp}°C
                  </span>
                </div>
                <p className="mb-6">
                  <span className="font-semibold">
                    {weather.city}
                    <span className=" font-normal text-sm ">
                      .{weather.country}.{weather.description}.
                    </span>
                  </span>
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {weatherDetails.map((detail, index) => (
                    <WeatherDetailItem
                      key={index}
                      label={detail.label}
                      value={detail.value}
                      unit={detail.unit}
                    />
                  ))}
                </div>
                <div className="border-t border-gray-200 my-6"></div>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm  font-semibold">Next 24 hours</h3>
                    <div className="flex gap-2">
                      <Icon
                        onClick={scrollLeft}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        icon="arrow_left_alt"
                      />
                      <Icon
                        onClick={scrollRight}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        icon="arrow_right_alt"
                      />
                    </div>
                  </div>

                  <div
                    ref={scrollContainerRef}
                    className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {weather.hourlyForecast.map((hour) => (
                      <div
                        key={hour.id}
                        className="flex flex-col items-center py-2 px-3 rounded-lg bg-[#EEF0F647] border border-basic-white transition-colors min-w-[60px] flex-shrink-0"
                      >
                        {hour.icon && (
                          <Icon icon={hour.icon} className="mb-1.5" />
                        )}
                        <span className="text-sm font-medium mb-0.5">
                          {hour.temperature}°C
                        </span>
                        <span className="text-xs text-basic-gray">
                          {hour.isNow ? 'Now' : hour.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-7 relative h-full">
              <div className="h-full relative overflow-hidden rounded-lg">
                <Map
                  className="w-full h-full"
                  initialCenter={[-8.2, 53.4]}
                  initialZoom={12}
                  showMapboxControls={false}
                  showLayerSelector={false}
                  showSearch={true}
                  searchPlaceholder="Find address or places..."
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
