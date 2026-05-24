import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import type {
  SelectOption,
  SceneSearchRequest,
  SceneSearchResultResponse,
} from '@@agrosphere/shared';
import {
  useCreateEosdaField,
  useCreateSceneSearch,
  useGetSceneSearchResult,
} from '@@agrosphere/shared';
import { convertParcelGeometryToCreateFieldDto } from '../utils/geometry-converter';

interface UseNitrogenSceneSearchParams {
  selectedParcelId: string | null;
  eosdaFieldId: string | null | undefined;
  parcelGeometry?: number[][];
  parcelName?: string;
}

export function useNitrogenFertilizationSceneSearch({
  selectedParcelId,
  eosdaFieldId,
  parcelGeometry,
  parcelName,
}: UseNitrogenSceneSearchParams) {
  const [currentFieldId, setCurrentFieldId] = useState<string | null>(null);
  const [sceneSearchRequestId, setSceneSearchRequestId] = useState<
    string | null
  >(null);
  const [shouldPollSceneSearch, setShouldPollSceneSearch] = useState(false);
  const [sceneSearchPollingReady, setSceneSearchPollingReady] = useState(false);
  const [immediateSceneSearchResult, setImmediateSceneSearchResult] =
    useState<SceneSearchResultResponse | null>(null);
  const [isCreatingField, setIsCreatingField] = useState(false);
  const sceneSearchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { mutateAsync: createEosdaField } = useCreateEosdaField();
  const { mutateAsync: createSceneSearch } = useCreateSceneSearch();

  const buildSceneSearchRequest = useCallback((): SceneSearchRequest => {
    const now = new Date();
    const dateEnd = now.toISOString().split('T')[0];
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 2);
    const dateStart = startDate.toISOString().split('T')[0];

    return {
      params: {
        date_start: dateStart,
        date_end: dateEnd,
        data_source: ['sentinel2'],
        sensors: ['sentinel2'],
        limit: 500,
      },
    };
  }, []);

  const shouldEnableSceneSearchQuery = Boolean(
    currentFieldId && sceneSearchRequestId && sceneSearchPollingReady
  );

  const {
    data: sceneSearchResult,
    isLoading: sceneSearchLoading,
    isFetching: sceneSearchFetching,
  } = useGetSceneSearchResult(
    currentFieldId,
    sceneSearchRequestId,
    shouldEnableSceneSearchQuery,
    shouldPollSceneSearch ? 2000 : undefined
  );

  const finalSceneSearchResult =
    sceneSearchResult || immediateSceneSearchResult;

  useEffect(() => {
    setCurrentFieldId(null);
    setSceneSearchRequestId(null);
    setShouldPollSceneSearch(false);
    setSceneSearchPollingReady(false);
    setImmediateSceneSearchResult(null);
    setIsCreatingField(false);

    if (sceneSearchTimerRef.current) {
      clearTimeout(sceneSearchTimerRef.current);
      sceneSearchTimerRef.current = null;
    }
  }, [selectedParcelId]);

  const triggerSceneSearch = useCallback(
    async (fieldId: string) => {
      void createSceneSearch({
        fieldId,
        data: buildSceneSearchRequest(),
      })
        .then((response) => {
          if (
            response &&
            'result' in response &&
            response.result &&
            response.status !== 'pending'
          ) {
            setImmediateSceneSearchResult(
              response as SceneSearchResultResponse
            );
            setSceneSearchRequestId(null);
            setShouldPollSceneSearch(false);
            setSceneSearchPollingReady(false);
            setIsCreatingField(false);
            if (sceneSearchTimerRef.current) {
              clearTimeout(sceneSearchTimerRef.current);
              sceneSearchTimerRef.current = null;
            }
          } else if (
            response &&
            'request_id' in response &&
            response.request_id
          ) {
            setImmediateSceneSearchResult(null);
            setSceneSearchRequestId(response.request_id);
            setShouldPollSceneSearch(false);
            setSceneSearchPollingReady(false);
            setIsCreatingField(false);
            if (sceneSearchTimerRef.current) {
              clearTimeout(sceneSearchTimerRef.current);
            }
            sceneSearchTimerRef.current = setTimeout(() => {
              setSceneSearchPollingReady(true);
              setShouldPollSceneSearch(true);
              sceneSearchTimerRef.current = null;
            }, 7000);
          }
        })
        .catch((error) => {
          console.error('[NitrogenFertilization] Scene search failed:', error);
          setSceneSearchRequestId(null);
          setShouldPollSceneSearch(false);
          setSceneSearchPollingReady(false);
          setIsCreatingField(false);
          if (sceneSearchTimerRef.current) {
            clearTimeout(sceneSearchTimerRef.current);
            sceneSearchTimerRef.current = null;
          }
          setImmediateSceneSearchResult(null);
        });
    },
    [buildSceneSearchRequest, createSceneSearch]
  );

  useEffect(() => {
    if (!selectedParcelId || !currentFieldId) {
      return;
    }

    if (!finalSceneSearchResult?.status) {
      return;
    }

    if (finalSceneSearchResult.status === 'pending') {
      setShouldPollSceneSearch(true);
    } else {
      setShouldPollSceneSearch(false);
      setSceneSearchPollingReady(false);
    }
  }, [finalSceneSearchResult, selectedParcelId, currentFieldId]);

  useEffect(() => {
    if (!selectedParcelId) {
      return;
    }

    if (eosdaFieldId) {
      setCurrentFieldId(eosdaFieldId);
      void triggerSceneSearch(eosdaFieldId);
      return;
    }

    if (!parcelGeometry || !parcelName) {
      console.log(
        '[NitrogenFertilization] No geometry or name, cannot create field'
      );
      return;
    }

    const fieldDto = convertParcelGeometryToCreateFieldDto(
      parcelGeometry,
      parcelName
    );

    if (!fieldDto) {
      console.error(
        '[NitrogenFertilization] Failed to convert geometry to field DTO'
      );
      return;
    }

    setIsCreatingField(true);
    void createEosdaField(fieldDto)
      .then((response) => {
        const fieldId =
          (response as any)?.field_id ?? (response as any)?.id ?? null;
        if (fieldId) {
          const fieldIdString = String(fieldId);
          setCurrentFieldId(fieldIdString);
          void triggerSceneSearch(fieldIdString);
        } else {
          console.error(
            '[NitrogenFertilization] Field created but no ID returned'
          );
          setIsCreatingField(false);
        }
      })
      .catch((error) => {
        console.error(
          '[NitrogenFertilization] Error creating EOSDA field:',
          error
        );
        setIsCreatingField(false);
      });
  }, [
    selectedParcelId,
    eosdaFieldId,
    parcelGeometry,
    parcelName,
    createEosdaField,
    triggerSceneSearch,
  ]);

  useEffect(() => {
    return () => {
      if (sceneSearchTimerRef.current) {
        clearTimeout(sceneSearchTimerRef.current);
      }
    };
  }, []);

  const imageDateOptions: SelectOption[] = useMemo(() => {
    if (
      !finalSceneSearchResult?.result ||
      finalSceneSearchResult.status === 'pending'
    ) {
      return [];
    }

    const filteredScenes = finalSceneSearchResult.result.filter(
      (item) => item.cloud < 10
    );

    if (filteredScenes.length === 0) {
      return [];
    }

    const dateMap = new Map<
      string,
      { date: string; cloud: number; viewId: string }
    >();

    filteredScenes.forEach((item) => {
      const dateObj = new Date(item.date);
      const dateString = dateObj.toISOString().split('T')[0];
      const existing = dateMap.get(dateString);

      if (!existing || item.cloud < existing.cloud) {
        dateMap.set(dateString, {
          date: dateString,
          cloud: item.cloud,
          viewId: item.view_id,
        });
      }
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(({ date, cloud }) => ({
        value: date,
        label: `${date} (${cloud.toFixed(1)}% cloud)`,
      }));
  }, [finalSceneSearchResult]);

  const isLoading =
    isCreatingField || sceneSearchLoading || sceneSearchFetching;

  return {
    imageDateOptions,
    isLoading,
    error: null, 
  };
}
