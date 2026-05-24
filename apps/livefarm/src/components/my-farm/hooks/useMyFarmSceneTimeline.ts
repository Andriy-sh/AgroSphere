import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import type {
  DownloadVisualGeometry,
  MapParcel,
  SceneTimelineItem,
  SceneSearchRequest,
  SceneSearchResultItem,
  SceneSearchResultResponse,
} from '@@agrosphere/shared';
import {
  useCreateSceneSearch,
  useGetSceneSearchResult,
  useCreateDownloadVisualTask,
  useGetDownloadVisualTaskStatus,
} from '@@agrosphere/shared';
import type { DownloadVisualRequest } from '@@agrosphere/shared';

const BAND_OPTIONS = ['NDVI', 'NDRE', 'MSAVI', 'RECI'] as const;
export type BandType = (typeof BAND_OPTIONS)[number];

const transformEosdaSceneToTimelineItem = (
  eosdaScene: SceneSearchResultItem,
  index: number
): SceneTimelineItem => {
  const dateObj = new Date(eosdaScene.date);
  const dateIso = dateObj.toISOString();
  const sceneID = `${eosdaScene.view_id}/${dateIso}/${index}`;

  return {
    tms: 'link',
    sceneID,
    cloudCoverage: eosdaScene.cloud,
    view_id: eosdaScene.view_id,
    date: dateIso,
  };
};

interface UseMyFarmSceneTimelineParams {
  showSceneTimeline?: boolean;
  mapParcels: MapParcel[];
  initialBandType?: BandType;
  onSceneTimelineSceneSelect?: (scene: SceneTimelineItem) => void;
}

export const useMyFarmSceneTimeline = ({
  showSceneTimeline = false,
  mapParcels,
  initialBandType = 'NDVI',
  onSceneTimelineSceneSelect,
}: UseMyFarmSceneTimelineParams) => {
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [imageryUrl, setImageryUrl] = useState<string | null>(null);
  const [sceneSearchFieldId, setSceneSearchFieldId] = useState<string | null>(
    null
  );
  const [sceneSearchRequestId, setSceneSearchRequestId] = useState<
    string | null
  >(null);
  const [shouldPollSceneSearch, setShouldPollSceneSearch] = useState(false);
  const [sceneSearchPollingReady, setSceneSearchPollingReady] = useState(false);
  const [immediateSceneSearchResult, setImmediateSceneSearchResult] =
    useState<SceneSearchResultResponse | null>(null);
  const [bandType, setBandType] = useState<BandType>(initialBandType);
  const [isImageryOverlayReady, setIsImageryOverlayReady] = useState(false);
  const [isLoadingOverlayReady, setIsLoadingOverlayReady] = useState(false);
  const [downloadTaskId, setDownloadTaskId] = useState<string | null>(null);
  const [downloadingSceneId, setDownloadingSceneId] = useState<string | null>(
    null
  );
  const [isSceneSearchLoading, setIsSceneSearchLoading] = useState(false);
  const sceneSearchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSelectedSceneRef = useRef<SceneTimelineItem | null>(null);
  const lastBandTypeRef = useRef<BandType>(initialBandType);
  const taskIdCacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!showSceneTimeline) {
      setBandType(initialBandType);
      lastBandTypeRef.current = initialBandType;
      lastSelectedSceneRef.current = null;
    }
  }, [showSceneTimeline, initialBandType]);

  const shouldLoadTimeline = showSceneTimeline && Boolean(selectedParcelId);

  const imageryGeometry: DownloadVisualGeometry | null = useMemo(() => {
    if (!selectedParcelId) {
      return null;
    }

    const parcel = mapParcels.find((item) => item.id === selectedParcelId);
    if (!parcel) {
      return null;
    }

    const coordinates = parcel.coordinates;
    if (
      !coordinates ||
      coordinates.length === 0 ||
      coordinates[0].length === 0
    ) {
      return null;
    }

    const firstPolygon = coordinates[0];

    return {
      type: 'Polygon',
      coordinates: firstPolygon as number[][][],
    };
  }, [mapParcels, selectedParcelId]);

  const effectiveImageryUrl = imageryUrl;

  useEffect(() => {
    setIsImageryOverlayReady(false);
    setIsLoadingOverlayReady(false);
  }, [imageryUrl]);

  const isImageLoading = useMemo(() => {
    return Boolean(downloadingSceneId && !isImageryOverlayReady);
  }, [downloadingSceneId, isImageryOverlayReady]);

  const processedMapParcels: MapParcel[] = useMemo(() => {
    const shouldHideParcel =
      selectedParcelId &&
      ((isImageLoading && isLoadingOverlayReady) || effectiveImageryUrl);

    if (!shouldHideParcel) {
      if (!selectedParcelId) {
        return mapParcels;
      }

      return mapParcels.map((parcel) =>
        parcel.id === selectedParcelId
          ? {
              ...parcel,
              borderColor: '#00AF4D',
              borderWidth: 2,
            }
          : parcel
      );
    }

    return mapParcels.map((parcel) =>
      parcel.id === selectedParcelId ? { ...parcel, visible: false } : parcel
    );
  }, [
    mapParcels,
    effectiveImageryUrl,
    selectedParcelId,
    isImageLoading,
    isLoadingOverlayReady,
  ]);

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

  const { mutateAsync: createSceneSearch } = useCreateSceneSearch();
  const { mutateAsync: createDownloadVisualTask } =
    useCreateDownloadVisualTask();

  const shouldEnableSceneSearchQuery = Boolean(
    sceneSearchFieldId && sceneSearchRequestId && sceneSearchPollingReady
  );

  const {
    data: sceneSearchResult,
    isLoading: sceneSearchLoading,
    isFetching: sceneSearchFetching,
  } = useGetSceneSearchResult(
    sceneSearchFieldId,
    sceneSearchRequestId,
    shouldEnableSceneSearchQuery,
    shouldPollSceneSearch ? 2000 : undefined
  );

  const finalSceneSearchResult =
    sceneSearchResult || immediateSceneSearchResult;

  const handleImageryOverlayReady = useCallback(() => {
    setIsImageryOverlayReady(true);
    setDownloadingSceneId(null);
    setDownloadTaskId(null);
  }, []);

  const handleLoadingOverlayReady = useCallback(() => {
    setIsLoadingOverlayReady(true);
  }, []);

  const sceneTimelineItems: SceneTimelineItem[] = useMemo(() => {
    if (
      !finalSceneSearchResult?.result ||
      finalSceneSearchResult.status === 'pending'
    ) {
      return [];
    }

    return finalSceneSearchResult.result
      .map((item, index) => transformEosdaSceneToTimelineItem(item, index))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [finalSceneSearchResult]);

  const sceneTimelineLoading = shouldLoadTimeline && isSceneSearchLoading;

  const [shouldPollDownloadTask, setShouldPollDownloadTask] = useState(false);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: downloadTaskStatus } = useGetDownloadVisualTaskStatus(
    downloadTaskId,
    Boolean(downloadTaskId),
    shouldPollDownloadTask ? 2000 : undefined
  );

  useEffect(() => {
    if (!shouldLoadTimeline) {
      setShouldPollSceneSearch(false);
      setSceneSearchPollingReady(false);
      setIsSceneSearchLoading(false);
      return;
    }

    if (!finalSceneSearchResult?.status) {
      return;
    }

    if (finalSceneSearchResult.status === 'pending') {
      setShouldPollSceneSearch(true);
      setIsSceneSearchLoading(true);
    } else {
      setShouldPollSceneSearch(false);
      setSceneSearchPollingReady(false);
      setIsSceneSearchLoading(false);
    }
  }, [finalSceneSearchResult, shouldLoadTimeline]);

  useEffect(() => {
    if (!downloadTaskStatus || !downloadingSceneId) {
      return;
    }

    const status = downloadTaskStatus.status;

    const resetDownloadState = () => {
      setDownloadingSceneId(null);
      setDownloadTaskId(null);
    };

    if (status === 'done' || status === 'complete' || status === 'completed') {
      setShouldPollDownloadTask(false);
      const newUrl = downloadTaskStatus.result?.url;
      if (newUrl) {
        setImageryUrl(newUrl);
        setDownloadTaskId(null);
      } else {
        resetDownloadState();
      }
    } else if (status === 'failed' || downloadTaskStatus.error) {
      setShouldPollDownloadTask(false);
      if (downloadingSceneId && lastSelectedSceneRef.current) {
        const cacheKey = `${lastSelectedSceneRef.current.view_id}-${bandType}`;
        taskIdCacheRef.current.delete(cacheKey);
      }

      resetDownloadState();
    } else if (status === 'pending' || status === 'processing') {
      setShouldPollDownloadTask(true);
    } else {
      setShouldPollDownloadTask(false);
    }
  }, [downloadTaskStatus, downloadingSceneId, bandType]);

  const handleBandTypeSelect = (band: BandType) => {
    setBandType(band);
  };

  const fetchSceneImagery = useCallback(
    (scene: SceneTimelineItem, options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      setImageryUrl(null);
      setIsSceneSearchLoading(true);

      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }

      lastSelectedSceneRef.current = scene;
      setSelectedSceneId(scene.sceneID);
      setDownloadTaskId(null);
      setDownloadingSceneId(scene.sceneID);
      setShouldPollDownloadTask(false);
      setIsImageryOverlayReady(false);
      setIsLoadingOverlayReady(false);

      if (!imageryGeometry || !scene.view_id) {
        setDownloadingSceneId(null);
        if (!silent) {
          onSceneTimelineSceneSelect?.(scene);
        }
        return;
      }

      const cacheKey = `${scene.view_id}-${bandType}`;

      const cachedTaskId = taskIdCacheRef.current.get(cacheKey);

      if (cachedTaskId) {
        setDownloadTaskId(cachedTaskId);
        setShouldPollDownloadTask(false);
        pollingTimerRef.current = setTimeout(() => {
          setShouldPollDownloadTask(true);
          pollingTimerRef.current = null;
        }, 7000);

        if (!silent) {
          onSceneTimelineSceneSelect?.(scene);
        }
        return;
      }

      const downloadRequest: DownloadVisualRequest = {
        type: 'jpeg',
        params: {
          view_id: scene.view_id,
          bm_type: bandType,
          geometry: imageryGeometry,
          px_size: 1,
          format: 'png',
          reference: `scene-${scene.sceneID}-${Date.now()}`,
          calibrate: 1,
        },
      };

      void createDownloadVisualTask(downloadRequest)
        .then((response) => {
          if (response?.task_id) {
            taskIdCacheRef.current.set(cacheKey, response.task_id);

            setDownloadTaskId(response.task_id);
            setShouldPollDownloadTask(false);
            pollingTimerRef.current = setTimeout(() => {
              setShouldPollDownloadTask(true);
              pollingTimerRef.current = null;
            }, 7000);
          } else {
            setDownloadingSceneId(null);
          }
          if (!silent) {
            onSceneTimelineSceneSelect?.(scene);
          }
        })
        .catch((error) => {
          setDownloadingSceneId(null);
          setIsSceneSearchLoading(false);
          if (!silent) {
            onSceneTimelineSceneSelect?.(scene);
          }
        });
    },
    [
      bandType,
      createDownloadVisualTask,
      imageryGeometry,
      onSceneTimelineSceneSelect,
    ]
  );

  useEffect(() => {
    if (lastBandTypeRef.current === bandType) {
      return;
    }
    lastBandTypeRef.current = bandType;

    setImageryUrl(null);
    setIsImageryOverlayReady(false);
    setIsLoadingOverlayReady(false);

    if (
      !showSceneTimeline ||
      !selectedSceneId ||
      !lastSelectedSceneRef.current
    ) {
      return;
    }

    fetchSceneImagery(lastSelectedSceneRef.current, { silent: true });
  }, [bandType, showSceneTimeline, selectedSceneId, fetchSceneImagery]);

  const handleSceneTimelineSelect = useCallback(
    (scene: SceneTimelineItem) => {
      setImageryUrl(null);
      fetchSceneImagery(scene);
    },
    [fetchSceneImagery]
  );

  const handleParcelSelect = useCallback(
    (parcel: MapParcel) => {

      if (!showSceneTimeline) {
        console.log('[MyFarm] Scene timeline not shown, ignoring click');
        return;
      }

      if (selectedParcelId === parcel.id) {
        setSelectedParcelId(null);
        setSelectedSceneId(null);
        setImageryUrl(null);
        setIsImageryOverlayReady(false);
        setSceneSearchFieldId(null);
        setSceneSearchRequestId(null);
        setShouldPollSceneSearch(false);
        setSceneSearchPollingReady(false);
        setImmediateSceneSearchResult(null);
        setDownloadTaskId(null);
        setDownloadingSceneId(null);
        setShouldPollDownloadTask(false);
        setIsSceneSearchLoading(false);
        setBandType(initialBandType);
        lastBandTypeRef.current = initialBandType;
        lastSelectedSceneRef.current = null;
        taskIdCacheRef.current.clear();
        if (sceneSearchTimerRef.current) {
          clearTimeout(sceneSearchTimerRef.current);
          sceneSearchTimerRef.current = null;
        }
        if (pollingTimerRef.current) {
          clearTimeout(pollingTimerRef.current);
          pollingTimerRef.current = null;
        }
        return;
      }

      setImageryUrl(null);
      setIsImageryOverlayReady(false);
      setIsLoadingOverlayReady(false);
      setSelectedSceneId(null);
      setDownloadTaskId(null);
      setDownloadingSceneId(null);
      setShouldPollDownloadTask(false);
      setShouldPollSceneSearch(false);
      setSceneSearchPollingReady(false);
      setImmediateSceneSearchResult(null);
      setSceneSearchFieldId(null);
      setSceneSearchRequestId(null);
      setIsSceneSearchLoading(false);
      setBandType(initialBandType);
      lastBandTypeRef.current = initialBandType;
      lastSelectedSceneRef.current = null;
      taskIdCacheRef.current.clear();

      if (sceneSearchTimerRef.current) {
        clearTimeout(sceneSearchTimerRef.current);
        sceneSearchTimerRef.current = null;
      }
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }

      setSelectedParcelId(parcel.id);

      const fieldIdForScenes = parcel.eosdaFieldId ?? parcel.farmId;

      if (!fieldIdForScenes) {
        console.log('[MyFarm] No field ID for scenes, cannot load timeline');
        return;
      }

      void createSceneSearch({
        fieldId: fieldIdForScenes,
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
            setSceneSearchFieldId(fieldIdForScenes);
            setSceneSearchRequestId(null);
            setShouldPollSceneSearch(false);
            setSceneSearchPollingReady(false);
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
            setSceneSearchFieldId(fieldIdForScenes);
            setSceneSearchRequestId(response.request_id);
            setShouldPollSceneSearch(false);
            setSceneSearchPollingReady(false);
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
          console.error('[EOSDA] Scene search failed:', error);
          setSceneSearchFieldId(null);
          setSceneSearchRequestId(null);
          setShouldPollSceneSearch(false);
          setSceneSearchPollingReady(false);
          if (sceneSearchTimerRef.current) {
            clearTimeout(sceneSearchTimerRef.current);
            sceneSearchTimerRef.current = null;
          }
          setImmediateSceneSearchResult(null);
        });
    },
    [
      buildSceneSearchRequest,
      createSceneSearch,
      selectedParcelId,
      showSceneTimeline,
      initialBandType,
    ]
  );

  useEffect(() => {
    return () => {
      if (sceneSearchTimerRef.current) {
        clearTimeout(sceneSearchTimerRef.current);
      }
      if (pollingTimerRef.current) {
        clearTimeout(pollingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup handled by the effect itself
    };
  }, []);

  return {
    mapParcels: processedMapParcels,
    imageryGeometry,
    imageryUrl: effectiveImageryUrl,
    selectedSceneId,
    shouldLoadTimeline,
    sceneTimelineItems,
    sceneTimelineLoading,
    handleParcelSelect,
    handleSceneTimelineSelect,
    bandType,
    bandOptions: BAND_OPTIONS,
    onBandTypeSelect: handleBandTypeSelect,
    onImageOverlayReady: handleImageryOverlayReady,
    onLoadingOverlayReady: handleLoadingOverlayReady,
    isImageLoading,
    isImageryOverlayReady,
  };
};
