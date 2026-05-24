import { useState, useMemo } from 'react';
import {
  MetricCategorySelect,
  Icon,
  SplitCard,
  BulletChart,
  GaugeChart,
  SoilDashboardProps,
  MetricCategory,
  getGaugeConfig,
} from '@@agrosphere/shared';
import {
  type SelectedEntity,
  getMetricsForSelectedEntity,
  getAllFarmsMetrics,
  type ZoneMetrics,
} from '../../data/soildashboard-data';
import {
  getChartTypeFromMetricId,
  getVariantFromMetricId,
} from '@@agrosphere/shared';

const metricCategories: MetricCategory[] = [
  {
    value: 'standard',
    label: 'Standard',
    metrics: [
      { value: 'ph', label: 'pH' },
      { value: 'lime-requirement', label: 'Lime Requirement' },
      { value: 'phosphorous-p', label: 'Phosphorous (P)' },
      { value: 'potassium-k', label: 'Potassium (K)' },
      { value: 'organic-matter-om', label: 'Organic Matter (OM) (%)' },
    ],
  },
  {
    value: 'trace-elements',
    label: 'Trace Elements',
    metrics: [
      { value: 'magnesium-mg', label: 'Magnesium (Mg)' },
      { value: 'mg-status', label: 'Mg Status' },
      { value: 'calcium-c', label: 'Calcium (C)' },
      { value: 'c-status', label: 'C Status' },
      { value: 'copper-cu', label: 'Copper (Cu)' },
      { value: 'cu-status', label: 'Cu Status' },
      { value: 'manganese-mn', label: 'Manganese (Mn)' },
      { value: 'mn-status', label: 'Mn Status' },
      { value: 'zinc-zn', label: 'Zinc (Zn)' },
      { value: 'zn-status', label: 'Zn Status' },
      { value: 'boron-b', label: 'Boron (B)' },
      { value: 'b-status', label: 'B Status' },
    ],
  },
  {
    value: 'biological',
    label: 'Biological',
    metrics: [],
  },
];

interface SoilMetric {
  id: string;
  category: string;
  title: string;
  description: string;
  value: number;
  chartType: 'bullet' | 'gauge';
  groupKey?: string;
}

function createSoilMetrics(metrics: ZoneMetrics): SoilMetric[] {
  return [
    {
      id: 'ph-grassland',
      category: 'standard',
      title: 'Avg. pH (Grassland)',
      description:
        'Neutral soil type. Neutral pH at 6.5 promotes nutrient uptake and consistent yields, and only 60% of all soil samples fall into this optimal range.',
      value: metrics.phGrassland,
      chartType: getChartTypeFromMetricId('ph-grassland'),
      groupKey: 'ph',
    },
    {
      id: 'ph-cereals-maize',
      category: 'standard',
      title: 'Avg. pH (Cereals/Maize)',
      description:
        'Neutral soil type. Maintaining pH at optimal levels for cereals and maize crops.',
      value: metrics.phCerealsMaize,
      chartType: getChartTypeFromMetricId('ph-cereals-maize'),
      groupKey: 'ph',
    },
    {
      id: 'lime-requirement',
      category: 'standard',
      title: 'Avg. Lime Requirement',
      description:
        'Moderate lime requirement. A lime requirement of 10 kg/ha supports optimal soil pH and nutrient availability, and 65% of all soil samples fall within this range.',
      value: metrics.lime,
      chartType: getChartTypeFromMetricId('lime-requirement'),
    },
    {
      id: 'phosphorous-p-grassland',
      category: 'standard',
      title: 'Avg. Phosphorous (P) (Grassland)',
      description:
        'Soil phosphorus level is moderate. Your soil has sufficient phosphorus for healthy growth, with a balanced nutrient status, supporting consistent yields, and 70% of all soil samples fall within this optimal range.',
      value: metrics.pIndexGrassland,
      chartType: getChartTypeFromMetricId('phosphorous-p-grassland'),
      groupKey: 'phosphorous-p',
    },
    {
      id: 'phosphorous-p-other-crop',
      category: 'standard',
      title: 'Avg. Phosphorous (P) (Other Crop)',
      description:
        'Soil phosphorus levels inadequate. Your soil needs phosphorus for optimal growth. 60% of soils for other crops are in the optimal P range.',
      value: metrics.pIndexOtherCrops,
      chartType: getChartTypeFromMetricId('phosphorous-p-other-crop'),
      groupKey: 'phosphorous-p',
    },
    {
      id: 'potassium-k-mineral-soil',
      category: 'standard',
      title: 'Avg. Potassium (K) (Mineral Soil)',
      description:
        'Soil potassium is adequate for growth. Your soil has sufficient potassium levels to support healthy crop development, with 65% of all soil samples falling within the optimal range.',
      value: metrics.kIndexMineralSoil,
      chartType: getChartTypeFromMetricId('potassium-k-mineral-soil'),
      groupKey: 'potassium-k',
    },
    {
      id: 'potassium-k-peat-soil',
      category: 'standard',
      title: 'Avg. Potassium (K) (Peat Soil)',
      description:
        'Soil potassium is adequate for growth. Your soil has good potassium levels, a key nutrient used by crops. 80% of peat soils are in the optimal K range.',
      value: metrics.kIndexPeatSoil,
      chartType: getChartTypeFromMetricId('potassium-k-peat-soil'),
      groupKey: 'potassium-k',
    },
    {
      id: 'organic-matter-om',
      category: 'standard',
      title: 'Avg. Organic Matter (OM)',
      description:
        'Soil has good organic content. Your soil contains 50% organic matter, supporting nutrient retention and healthy soil structure, with 70% of all soil samples falling within this optimal range.',
      value: metrics.organicMatter,
      chartType: getChartTypeFromMetricId('organic-matter-om'),
    },
    {
      id: 'magnesium-mg',
      category: 'trace-elements',
      title: 'Avg. Magnesium (Mg)',
      description:
        'Magnesium levels adequate. Magnesium at 200 mg/l supports chlorophyll production and photosynthesis, essential for healthy plant growth, and 55% of all soil samples fall within this optimal range.',
      value: metrics.magnesiumMg,
      chartType: getChartTypeFromMetricId('magnesium-mg'),
    },
    {
      id: 'calcium-c',
      category: 'trace-elements',
      title: 'Avg. Calcium (C)',
      description:
        'Calcium levels optimal. Calcium at 2200 mg/l strengthens cell walls and improves root development, with 62% of all soil samples falling within this optimal range.',
      value: metrics.calciumC,
      chartType: getChartTypeFromMetricId('calcium-c'),
    },
    {
      id: 'copper-cu',
      category: 'trace-elements',
      title: 'Avg. Copper (Cu)',
      description:
        'Copper levels sufficient. Copper at 2.1 mg/l facilitates enzyme activity and supports plant metabolism, and 58% of all soil samples fall within this optimal range.',
      value: metrics.copperCu,
      chartType: getChartTypeFromMetricId('copper-cu'),
    },
    {
      id: 'manganese-mn',
      category: 'trace-elements',
      title: 'Avg. Manganese (Mn)',
      description:
        'Manganese levels moderate. Manganese at 30 mg/l enhances photosynthesis and nitrogen metabolism, supporting optimal crop yields, and 68% of all soil samples fall within this optimal range.',
      value: metrics.manganeseMn,
      chartType: getChartTypeFromMetricId('manganese-mn'),
    },
    {
      id: 'zinc-zn',
      category: 'trace-elements',
      title: 'Avg. Zinc (Zn)',
      description:
        'Zinc levels adequate. Zinc at 2.35 mg/l regulates enzyme function and promotes growth, essential for healthy crop development, and 60% of all soil samples fall within this optimal range.',
      value: metrics.zincZn,
      chartType: getChartTypeFromMetricId('zinc-zn'),
    },
    {
      id: 'boron-b',
      category: 'trace-elements',
      title: 'Avg. Boron (B)',
      description:
        'Boron levels sufficient. Boron at 2.0 mg/l supports cell division and carbohydrate metabolism, improving crop quality, and 64% of all soil samples fall within this optimal range.',
      value: metrics.boronB,
      chartType: getChartTypeFromMetricId('boron-b'),
    },
  ];
}

const parseDescription = (description: string) => {
  const parts = description.split('.');
  const title = parts[0] || '';
  const restDescription = parts.slice(1).join('.').trim();

  const percentageRegex = /(\d+%)/g;
  const textParts = restDescription.split(percentageRegex);

  return { title, textParts };
};

const renderDescription = (description: string) => {
  const { title, textParts } = parseDescription(description);

  return (
    <div className="text-sm text-basic-black flex flex-col text-center items-center justify-center">
      <span className="font-medium">{title}.</span>
      <div>
        {textParts.map((part, index) => {
          if (part.match(/^\d+%$/)) {
            return (
              <span key={index} className="font-medium">
                {part}
              </span>
            );
          }
          return (
            <span key={index} className="text-basic-gray font-normal">
              {part}
            </span>
          );
        })}
      </div>
    </div>
  );
};

interface BulletChartConfig {
  min: number;
  max: number;
  targetValue?: number;
  targetLabel?: string;
  minValueLabel: string;
  maxValueLabel: string;
  labels?: { value: number; label: string }[];
}

const getBulletChartConfig = (
  variant: SoilDashboardProps['variant'],
  value: number
): BulletChartConfig => {
  const gaugeConfig = getGaugeConfig(variant);

  let targetValue: number;

  if (variant === 'phRangeGrassland') {
    targetValue = 6.5;
  } else if (variant === 'phRangeCerealsMaize') {
    targetValue = 6.3;
  } else {
    const targetLabel = gaugeConfig.labels.find((l) => {
      const lowerLabel = l.label.toLowerCase();
      return lowerLabel.includes('index 3') || lowerLabel.includes('normal');
    });

    targetValue = targetLabel
      ? targetLabel.value
      : gaugeConfig.labels.length >= 3
      ? gaugeConfig.labels[2].value
      : (gaugeConfig.min + gaugeConfig.max) / 2;
  }

  const minLabel = gaugeConfig.labels[0];
  const maxLabel = gaugeConfig.labels[gaugeConfig.labels.length - 1];

  const minLabelText = minLabel?.label || `<${gaugeConfig.min}`;
  const maxLabelText = maxLabel?.label || `>${gaugeConfig.max}`;

  const useMultipleLabels = gaugeConfig.labels.length > 2;

  let targetLabelText: string | undefined;
  if (!useMultipleLabels) {
    if (variant === 'phRangeGrassland') {
      targetLabelText = 'Target 6.5';
    } else if (variant === 'phRangeCerealsMaize') {
      targetLabelText = 'Target 6.3';
    } else {
      const targetLabel = gaugeConfig.labels.find((l) => {
        const lowerLabel = l.label.toLowerCase();
        return lowerLabel.includes('index 3') || lowerLabel.includes('normal');
      });
      targetLabelText =
        targetLabel?.label || gaugeConfig.labels[2]?.label || 'Target';
    }
  }

  return {
    min: gaugeConfig.min,
    max: gaugeConfig.max,
    targetValue: useMultipleLabels ? undefined : targetValue,
    targetLabel: useMultipleLabels ? undefined : targetLabelText,
    minValueLabel: minLabelText,
    maxValueLabel: maxLabelText,
    labels: useMultipleLabels ? gaugeConfig.labels : undefined,
  };
};

interface SoilDashboardChartsProps {
  selectedEntity: SelectedEntity | null;
  onChartClick?: (metricId: string | null) => void;
}

export default function SoilDashboardCharts({
  selectedEntity,
  onChartClick,
}: SoilDashboardChartsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('standard');

  const currentMetrics: ZoneMetrics = useMemo(() => {
    if (selectedEntity) {
      const metrics = getMetricsForSelectedEntity(selectedEntity);
      return metrics || getAllFarmsMetrics();
    }
    return getAllFarmsMetrics();
  }, [selectedEntity]);

  const soilMetrics = useMemo(() => {
    return createSoilMetrics(currentMetrics);
  }, [currentMetrics]);

  const initialSelectedMetrics = metricCategories.reduce((acc, category) => {
    acc[category.value] = category.metrics.map((metric) => metric.value);
    return acc;
  }, {} as Record<string, string[]>);

  const [selectedMetrics, setSelectedMetrics] = useState<
    Record<string, string[]>
  >(initialSelectedMetrics);

  const handleSelectionChange = (
    categoryValue: string,
    selectedMetricValues: string[]
  ) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [categoryValue]: selectedMetricValues,
    }));
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
  };

  return (
    <div className="flex flex-col h-full gap-5">
      <div className="flex items-center gap-2">
        <Icon icon="analytics" className="text-basic-green" size="xxl" />
        <h2 className="text-[28px] font-semibold text-basic-black">
          Soil health dashboard
        </h2>
      </div>
      <MetricCategorySelect
        categories={metricCategories}
        selectedMetrics={selectedMetrics}
        onSelectionChange={handleSelectionChange}
        value={selectedCategory}
        onCategoryChange={handleCategoryChange}
        placeholder="Search metric"
      />

      {(() => {
        const categoryMetrics = soilMetrics.filter(
          (metric) => metric.category === selectedCategory
        );

        const selectedForCategory = selectedMetrics[selectedCategory] || [];

        if (selectedCategory === 'biological') {
          return (
            <SplitCard
              className="rounded-xl border bg-white !border-basic-gray-light flex-grow"
              topClassName="flex justify-between items-center p-5"
              topContent={
                <h2 className="text-base font-semibold">Biological Metrics</h2>
              }
              bottomContent={
                <div className="flex items-center justify-center h-full min-h-[250px]">
                  <p className="text-basic-gray text-center">
                    No data available
                  </p>
                </div>
              }
            />
          );
        }

        if (selectedForCategory.length === 0) {
          return (
            <SplitCard
              className="rounded-xl border bg-white !border-basic-gray-light flex-grow"
              topClassName="flex justify-between items-center p-5"
              topContent={
                <h2 className="text-base font-semibold">
                  {metricCategories.find((c) => c.value === selectedCategory)
                    ?.label || 'Metrics'}
                </h2>
              }
              bottomContent={
                <div className="flex items-center justify-center h-full min-h-[250px]">
                  <p className="text-basic-gray text-center">
                    Select metrics to display
                  </p>
                </div>
              }
            />
          );
        }

        const groupToMetricIds: Record<string, string[]> = {
          ph: ['ph-grassland', 'ph-cereals-maize'],
          'phosphorous-p': [
            'phosphorous-p-grassland',
            'phosphorous-p-other-crop',
          ],
          'potassium-k': ['potassium-k-mineral-soil', 'potassium-k-peat-soil'],
        };

        const expandedSelectedMetrics = new Set<string>();
        selectedForCategory.forEach((selectedId) => {
          if (groupToMetricIds[selectedId]) {
            groupToMetricIds[selectedId].forEach((metricId) =>
              expandedSelectedMetrics.add(metricId)
            );
          } else {
            expandedSelectedMetrics.add(selectedId);
          }
        });

        const filteredMetrics = categoryMetrics.filter((metric) =>
          expandedSelectedMetrics.has(metric.id)
        );

        const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
          if (metric.groupKey) {
            if (!acc[metric.groupKey]) {
              acc[metric.groupKey] = [];
            }
            acc[metric.groupKey].push(metric);
          } else {
            acc[metric.id] = [metric];
          }
          return acc;
        }, {} as Record<string, SoilMetric[]>);

        return Object.entries(groupedMetrics).map(([groupKey, metrics]) => {
          if (metrics.length > 1) {
            const firstMetric = metrics[0];
            const secondMetric = metrics[1];

            let groupTitle = '';
            if (groupKey === 'ph') {
              groupTitle = 'Avg. pH';
            } else if (groupKey === 'phosphorous-p') {
              groupTitle = 'Avg. Phosphorous (P)';
            } else if (groupKey === 'potassium-k') {
              groupTitle = 'Avg. Potassium (K)';
            } else {
              groupTitle = firstMetric.title;
            }

            const firstVariant = getVariantFromMetricId(firstMetric.id);
            const secondVariant = getVariantFromMetricId(secondMetric.id);
            const firstBulletConfig = getBulletChartConfig(
              firstVariant,
              firstMetric.value
            );
            const secondBulletConfig = getBulletChartConfig(
              secondVariant,
              secondMetric.value
            );

            const firstTitle = firstMetric.title.includes('Grassland')
              ? 'Grassland'
              : firstMetric.title.includes('Cereals') ||
                firstMetric.title.includes('Maize')
              ? 'Cereals/Maize'
              : firstMetric.title.includes('Mineral')
              ? 'Mineral Soil'
              : firstMetric.title;
            const secondTitle =
              secondMetric.title.includes('Cereals') ||
              secondMetric.title.includes('Maize')
                ? 'Cereals/Maize'
                : secondMetric.title.includes('Other Crop')
                ? 'Other Crop'
                : secondMetric.title.includes('Peat')
                ? 'Peat Soil'
                : secondMetric.title;

            const additionalSections = [];
            if (
              firstMetric.description &&
              firstMetric.description !== 'no description'
            ) {
              additionalSections.push({
                content: renderDescription(firstMetric.description),
              });
            }

            return (
              <div key={groupKey} onClick={() => onChartClick?.(groupKey)}>
                <SplitCard
                  className="rounded-xl border bg-white !border-basic-gray-light cursor-pointer transition-all hover:shadow-md"
                  topClassName="flex justify-between items-center p-5"
                  topContent={
                    <h2 className="text-base font-semibold">{groupTitle}</h2>
                  }
                  bottomContent={
                    <div className="gap-6">
                      <BulletChart
                        title={firstTitle}
                        value={firstMetric.value}
                        min={firstBulletConfig.min}
                        max={firstBulletConfig.max}
                        targetValue={firstBulletConfig.targetValue}
                        targetLabel={firstBulletConfig.targetLabel}
                        currentValueLabel={firstMetric.value.toFixed(1)}
                        minValueLabel={firstBulletConfig.minValueLabel}
                        maxValueLabel={firstBulletConfig.maxValueLabel}
                        labels={firstBulletConfig.labels}
                        className="w-full"
                        height={28}
                      />
                      <BulletChart
                        title={secondTitle}
                        value={secondMetric.value}
                        min={secondBulletConfig.min}
                        max={secondBulletConfig.max}
                        targetValue={secondBulletConfig.targetValue}
                        targetLabel={secondBulletConfig.targetLabel}
                        currentValueLabel={secondMetric.value.toFixed(1)}
                        minValueLabel={secondBulletConfig.minValueLabel}
                        maxValueLabel={secondBulletConfig.maxValueLabel}
                        labels={secondBulletConfig.labels}
                        className="w-full"
                        height={28}
                      />
                    </div>
                  }
                  additionalSections={
                    additionalSections.length > 0
                      ? additionalSections
                      : undefined
                  }
                />
              </div>
            );
          }

          const metric = metrics[0];
          const variant = getVariantFromMetricId(metric.id);
          const isBulletChart = metric.chartType === 'bullet';

          const additionalSections = [];
          if (metric.description && metric.description !== 'no description') {
            additionalSections.push({
              content: renderDescription(metric.description),
            });
          }

          return (
            <div key={metric.id} onClick={() => onChartClick?.(metric.id)}>
              <SplitCard
                className="rounded-xl border bg-white !border-basic-gray-light cursor-pointer transition-all hover:shadow-md"
                topClassName="flex justify-between items-center p-5"
                topContent={
                  <h2 className="text-base font-semibold">{metric.title}</h2>
                }
                bottomContent={
                  <div className="flex items-center justify-center h-full min-h-[250px]">
                    {isBulletChart
                      ? (() => {
                          const bulletConfig = getBulletChartConfig(
                            variant,
                            metric.value
                          );
                          return (
                            <BulletChart
                              value={metric.value}
                              min={bulletConfig.min}
                              max={bulletConfig.max}
                              targetValue={bulletConfig.targetValue}
                              targetLabel={bulletConfig.targetLabel}
                              currentValueLabel={metric.value.toFixed(1)}
                              minValueLabel={bulletConfig.minValueLabel}
                              maxValueLabel={bulletConfig.maxValueLabel}
                              labels={bulletConfig.labels}
                              className="w-full"
                              height={28}
                            />
                          );
                        })()
                      : (() => {
                          const gaugeConfig = getGaugeConfig(variant);
                          return (
                            <GaugeChart
                              width={400}
                              height={250}
                              showValueLabel={true}
                              showPointer={true}
                              value={metric.value}
                              {...gaugeConfig}
                            />
                          );
                        })()}
                  </div>
                }
                additionalSections={
                  additionalSections.length > 0 ? additionalSections : undefined
                }
              />
            </div>
          );
        });
      })()}
    </div>
  );
}
