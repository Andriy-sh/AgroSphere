import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SceneTimelineItem } from '@@agrosphere/shared';

const SCENE_TIMELINE_QUERY_KEY = ['scene-timeline'];

interface SceneTimelineResponse {
  scenes: SceneTimelineItem[];
}

const fetchSceneTimeline = async (
  parcelId: string
): Promise<SceneTimelineItem[]> => {
  const response = await fetch(
    `/api/scene-timeline?parcelId=${encodeURIComponent(parcelId)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch scene timeline: ${response.status}`);
  }

  const data: SceneTimelineResponse = await response.json();
  return data.scenes ?? [];
};

export const useSceneTimeline = (
  enabled: boolean,
  parcelId?: string | null
): {
  scenes: SceneTimelineItem[];
  loading: boolean;
  error: unknown;
  refresh: () => Promise<SceneTimelineItem[] | undefined>;
} => {
  const shouldFetch = enabled && Boolean(parcelId);

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    SceneTimelineItem[]
  >({
    queryKey: [...SCENE_TIMELINE_QUERY_KEY, parcelId],
    queryFn: () => fetchSceneTimeline(parcelId as string),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
  });

  const scenes = useMemo<SceneTimelineItem[]>(() => data ?? [], [data]);

  const refresh = useCallback(async () => {
    if (!shouldFetch) {
      return data;
    }
    const result = await refetch();
    return result.data;
  }, [shouldFetch, data, refetch]);

  return {
    scenes,
    loading: shouldFetch && (isLoading || isFetching),
    error,
    refresh,
  };
};
