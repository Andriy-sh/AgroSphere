'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapProvider } from './context/map-context';
import { MapSearchBar } from './components/map-search-bar';
import { MapSizeControls } from './components/map-size-controls';
import { LayerSelector } from './components/layer-selector';
import {
  ParcelZoneSelector,
  type ParcelZoneMode,
} from './components/parcel-zone-selector';
import { ParcelsLayer } from './layers/parcels-layer';
import { ZonesLayer } from './layers/zones-layer';
import { MapProgressBar, ProgressStep } from './map-progress-bar';
import { MapLegend, type MapLegendProps } from './map-legend';
import { Button } from '../button/button';
import type { MapParcel, MapZone } from '../../types/map';
import {
  getGaugeConfig,
  getVariantFromMetricId,
} from '../../data/soildashboard-variations';

const createCustomIcon = (color = '#29B54C') => {
  const svgString = `
<svg width="32" height="52" viewBox="0 0 32 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C24.8366 0 32 7.16344 32 16C32 24.3226 25.6456 31.1611 17.5238 31.9284V48.7619C17.5238 49.6035 16.8416 50.2857 16 50.2857C15.1584 50.2857 14.4762 49.6035 14.4762 48.7619V31.9284C6.35439 31.1611 0 24.3226 0 16C0 7.16344 7.16344 0 16 0Z" fill="${color}"/>
<path d="M21.3337 16.0003C21.3337 13.0548 18.9458 10.667 16.0003 10.667C13.0548 10.667 10.667 13.0548 10.667 16.0003C10.667 18.9458 13.0548 21.3337 16.0003 21.3337C18.9458 21.3337 21.3337 18.9458 21.3337 16.0003Z" fill="white"/>
<path opacity="0.3" d="M16.0019 51.8095C18.1058 51.8095 19.8114 50.9567 19.8114 49.9048C19.8114 48.8528 18.1058 48 16.0019 48C13.898 48 12.1924 48.8528 12.1924 49.9048C12.1924 50.9567 13.898 51.8095 16.0019 51.8095Z" fill="${color}"/>
</svg>
  `;

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

const createUserLocationIcon = () => {
  const svgString = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
<circle cx="12" cy="12" r="3" fill="white"/>
</svg>
  `;

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

const createMarkerElement = (iconUrl: string) => {
  const element = document.createElement('div');
  element.style.width = '40px';
  element.style.height = '40px';
  element.style.backgroundImage = `url(${iconUrl})`;
  element.style.backgroundSize = 'contain';
  element.style.backgroundRepeat = 'no-repeat';
  element.style.backgroundPosition = 'center';
  element.style.cursor = 'pointer';
  element.style.pointerEvents = 'auto';
  return element;
};

interface SearchResult {
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
}

const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

export interface MapProps {
  children?: ReactNode;
  className?: string;
  accessToken?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  maxZoom?: number;
  minZoom?: number;
  showMapboxControls?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  showSizeControls?: boolean;
  panelSide?: 'left' | 'right';
  initialMapSize?: number;
  currentMapSize?: number;
  onMapSizeChange?: (size: number) => void;
  isTasksPage?: boolean;
  isTaskDetail?: boolean;
  showFilters?: boolean;
  onGeolocate?: (coords: { latitude: number; longitude: number }) => void;
  onMapClick?: (coords: {
    latitude: number;
    longitude: number;
    location_xy?: [number, number];
  }) => void;
  onSearchResult?: (result: SearchResult) => void;
  autoGeolocate?: boolean;
  initialSearchValue?: string;
  customActionButton?: React.ReactNode;
  showFullscreenButton?: boolean;
  showCustomMarker?: boolean;
  onClearMarkerRef?: React.MutableRefObject<(() => void) | null>;
  onSetMarkerRef?: React.MutableRefObject<
    ((lat: number, lng: number, color?: string) => void) | null
  >;
  onClearUserLocationRef?: React.MutableRefObject<(() => void) | null>;
  onSetUserLocationRef?: React.MutableRefObject<
    ((lat: number, lng: number) => void) | null
  >;
  onResetAutoGeolocateRef?: React.MutableRefObject<(() => void) | null>;
  showLayerSelector?: boolean;
  layerVisibility?: {
    farmLocations?: boolean;
    farmParcels?: boolean;
    farmZones?: boolean;
    showTasks?: boolean;
    showParcels?: boolean;
    parcelZoneMode?: 'parcels' | 'zones';
  };
  onLayerVisibilityChange?: (layer: string, visible: boolean) => void;
  showProgressBar?: boolean;
  progressSteps?: ProgressStep[];
  currentProgressStep?: number;
  onProgressBarClose?: () => void;
  showLegend?: boolean;
  legendTitle?: string;
  legendLevels?: MapLegendProps['levels'];
  legendPosition?: 'left' | 'right';
  // Parcel/Zone mode props
  parcelZoneMode?: ParcelZoneMode;
  onParcelZoneModeChange?: (mode: ParcelZoneMode) => void;
  parcels?: MapParcel[];
  zones?: MapZone[];
  onParcelClick?: (parcel: MapParcel) => void;
  onZoneClick?: (zone: MapZone) => void;
  enableParcelSelection?: boolean;
  selectedParcelId?: string | null;
  showParcelZoneSelector?: boolean;
  showParcelsOption?: boolean;
  showZonesOption?: boolean;
  showParcelBorderWithZones?: boolean;
  showPhColors?: boolean;
  showZoneLabels?: boolean;
  hasBottomTimeline?: boolean;
  selectedMetricId?: string;
  parcelStyleVariant?: string;
}

export const Map = React.forwardRef<mapboxgl.Map, MapProps>(
  (
    {
      children,
      className = '',
      accessToken,
      initialCenter = [-8.2, 53.4],
      initialZoom = 12,
      maxZoom = 18,
      minZoom = 3,
      showMapboxControls = true,
      showSearch = true,
      searchPlaceholder = 'Search for farms or locations...',
      showSizeControls = false,
      panelSide = 'left',
      initialMapSize = 100,
      currentMapSize,
      onMapSizeChange,
      isTasksPage = false,
      isTaskDetail = false,
      showFilters = false,
      onGeolocate,
      onMapClick,
      onSearchResult,
      autoGeolocate = false,
      initialSearchValue,
      customActionButton,
      showFullscreenButton = true,
      showCustomMarker = true,
      onClearMarkerRef,
      onSetMarkerRef,
      onClearUserLocationRef,
      onSetUserLocationRef,
      onResetAutoGeolocateRef,
      showLayerSelector = false,
      layerVisibility,
      onLayerVisibilityChange,
      showProgressBar = false,
      progressSteps = [],
      currentProgressStep = 0,
      onProgressBarClose,
      showLegend = false,
      legendTitle,
      legendLevels,
      legendPosition = 'left',
      // Parcel/Zone mode props
      parcelZoneMode: parcelZoneModeProp,
      onParcelZoneModeChange,
      parcels = [],
      zones = [],
      onParcelClick,
      onZoneClick,
      enableParcelSelection = false,
      selectedParcelId = null,
      showParcelZoneSelector = false,
      showParcelsOption = true,
      showZonesOption = true,
      showParcelBorderWithZones = false,
      showPhColors = false,
      showZoneLabels = true,
      hasBottomTimeline = false,
      selectedMetricId,
      parcelStyleVariant,
    },
    ref
  ) => {
    const [internalMode, setInternalMode] = useState<ParcelZoneMode>('parcels');

    const modeFromLayerVisibility = useMemo<ParcelZoneMode | null>(() => {
      if (!layerVisibility) return null;
      if (layerVisibility.parcelZoneMode) {
        return layerVisibility.parcelZoneMode;
      }
      if (layerVisibility.farmParcels && !layerVisibility.farmZones) {
        return 'parcels';
      }
      if (layerVisibility.farmZones && !layerVisibility.farmParcels) {
        return 'zones';
      }
      return null;
    }, [layerVisibility]);

    const parcelZoneMode =
      parcelZoneModeProp ?? modeFromLayerVisibility ?? internalMode;

    const handleModeChange = useCallback(
      (mode: ParcelZoneMode) => {
        if (onParcelZoneModeChange) {
          onParcelZoneModeChange(mode);
        } else {
          setInternalMode(mode);
        }
      },
      [onParcelZoneModeChange]
    );

    const handleLayerVisibilityChangeInternal = useCallback(
      (layer: string, visible: boolean) => {
        if (layer.startsWith('parcelZoneMode:')) {
          const mode = layer.split(':')[1] as ParcelZoneMode;
          if (visible) {
            handleModeChange(mode);
            if (onLayerVisibilityChange) {
              onLayerVisibilityChange(layer, visible);
            }
          }
        } else {
          if (onLayerVisibilityChange) {
            onLayerVisibilityChange(layer, visible);
          }
        }
      },
      [onLayerVisibilityChange, handleModeChange]
    );
    const mapboxAccessToken =
      accessToken || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [styleLoaded, setStyleLoaded] = useState(false);
    const [mapSize, setMapSize] = useState(initialMapSize);
    const [isGeolocating, setIsGeolocating] = useState(false);
    const [hasAutoGeolocated, setHasAutoGeolocated] = useState(false);
    const [userLocationMarker, setUserLocationMarker] =
      useState<mapboxgl.Marker | null>(null);
    const [userLocationIconUrl, setUserLocationIconUrl] = useState<
      string | null
    >(null);
    const currentMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const currentIconUrlRef = useRef<string | null>(null);

    const metricConfig = useMemo(() => {
      if (!selectedMetricId) return null;
      const variant = getVariantFromMetricId(selectedMetricId);
      return getGaugeConfig(variant);
    }, [selectedMetricId]);
    const lastClickCoordsRef = useRef<{
      lat: number;
      lng: number;
    } | null>(null);
    const previousMapSizeRef = useRef(initialMapSize);
    const onMapClickRef = useRef<MapProps['onMapClick']>(onMapClick);
    const showCustomMarkerRef = useRef(showCustomMarker);

    useEffect(() => {
      onMapClickRef.current = onMapClick;
    }, [onMapClick]);

    useEffect(() => {
      showCustomMarkerRef.current = showCustomMarker;
    }, [showCustomMarker]);

    const updateMarker = useCallback(
      (latitude: number, longitude: number, color = '#29B54C') => {
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
          currentMarkerRef.current = null;
        }

        if (currentIconUrlRef.current) {
          URL.revokeObjectURL(currentIconUrlRef.current);
          currentIconUrlRef.current = null;
        }

        if (!map.current) return;

        const iconUrl = createCustomIcon(color);

        const marker = new mapboxgl.Marker({
          element: createMarkerElement(iconUrl),
          scale: 1.2,
          anchor: 'bottom',
        })
          .setLngLat([longitude, latitude])
          .addTo(map.current);

        currentMarkerRef.current = marker;
        currentIconUrlRef.current = iconUrl;
      },
      []
    );

    const clearMarker = useCallback(() => {
      if (currentMarkerRef.current) {
        currentMarkerRef.current.remove();
        currentMarkerRef.current = null;
      }
      if (currentIconUrlRef.current) {
        URL.revokeObjectURL(currentIconUrlRef.current);
        currentIconUrlRef.current = null;
      }
      lastClickCoordsRef.current = null;
    }, []);

    const clearUserLocation = useCallback(() => {
      if (userLocationMarker) {
        userLocationMarker.remove();
        setUserLocationMarker(null);
      }
      if (userLocationIconUrl) {
        URL.revokeObjectURL(userLocationIconUrl);
        setUserLocationIconUrl(null);
      }
    }, [userLocationMarker, userLocationIconUrl]);

    const setUserLocation = useCallback(
      (latitude: number, longitude: number) => {
        if (userLocationMarker) {
          userLocationMarker.remove();
          setUserLocationMarker(null);
        }
        if (userLocationIconUrl) {
          URL.revokeObjectURL(userLocationIconUrl);
          setUserLocationIconUrl(null);
        }

        if (map.current) {
          const iconUrl = createUserLocationIcon();
          const element = document.createElement('div');
          element.style.width = '24px';
          element.style.height = '24px';
          element.style.backgroundImage = `url(${iconUrl})`;
          element.style.backgroundSize = 'contain';
          element.style.backgroundRepeat = 'no-repeat';
          element.style.backgroundPosition = 'center';
          element.style.cursor = 'pointer';
          element.style.pointerEvents = 'auto';
          element.title = 'Click to remove location marker';

          const marker = new mapboxgl.Marker({
            element: element,
            scale: 1.2,
            anchor: 'center',
          })
            .setLngLat([longitude, latitude])
            .addTo(map.current);

          element.addEventListener('click', () => {
            clearUserLocation();
          });

          setUserLocationMarker(marker);
          setUserLocationIconUrl(iconUrl);
        }
      },
      [userLocationMarker, userLocationIconUrl, clearUserLocation]
    );

    const resetAutoGeolocate = useCallback(() => {
      setHasAutoGeolocated(false);
    }, []);

    const handleMapSizeChange = useCallback(
      (newSize: number) => {
        setMapSize(newSize);
        onMapSizeChange?.(newSize);

        setTimeout(() => {
          if (map.current) {
            map.current.resize();
          }
        }, 100);
      },
      [onMapSizeChange]
    );

    const handleGeolocation = useCallback(() => {
      if (!map.current || !navigator.geolocation) return;

      setIsGeolocating(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setUserLocation(latitude, longitude);

          map.current?.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1000,
          });

          if (onGeolocate) {
            onGeolocate({
              latitude,
              longitude,
            });
          }
          setIsGeolocating(false);
        },
        () => {
          setIsGeolocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }, [onGeolocate, setUserLocation]);

    const handleSearchResult = useCallback(
      (result: SearchResult) => {
        if (!map.current) return;

        if (result.center) {
          const [lng, lat] = result.center;
          updateMarker(lat, lng);
          lastClickCoordsRef.current = { lat, lng };
        }

        if (result.bbox) {
          map.current.fitBounds(
            result.bbox as [number, number, number, number],
            {
              padding: 50,
              duration: 1000,
            }
          );
        } else {
          map.current.flyTo({
            center: result.center,
            zoom: 15,
            duration: 1000,
          });
        }

        if (onSearchResult) {
          onSearchResult(result);
        }
      },
      [onSearchResult, updateMarker]
    );

    useEffect(() => {
      if (onClearMarkerRef) {
        onClearMarkerRef.current = clearMarker;
      }
    }, [onClearMarkerRef, clearMarker]);

    useEffect(() => {
      if (onSetMarkerRef) {
        onSetMarkerRef.current = updateMarker;
      }
    }, [onSetMarkerRef, updateMarker]);

    useEffect(() => {
      if (onClearUserLocationRef) {
        onClearUserLocationRef.current = clearUserLocation;
      }
    }, [onClearUserLocationRef, clearUserLocation]);

    useEffect(() => {
      if (onSetUserLocationRef) {
        onSetUserLocationRef.current = setUserLocation;
      }
    }, [onSetUserLocationRef, setUserLocation]);

    useEffect(() => {
      if (onResetAutoGeolocateRef) {
        onResetAutoGeolocateRef.current = resetAutoGeolocate;
      }
    }, [onResetAutoGeolocateRef, resetAutoGeolocate]);

    useEffect(() => {
      if (!mapContainer.current || map.current) return;

      if (!mapboxAccessToken) {
        return;
      }

      mapboxgl.accessToken = mapboxAccessToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: initialCenter,
        zoom: initialZoom,
        maxZoom: maxZoom,
        minZoom: minZoom,
        attributionControl: false,
      });

      if (ref && typeof ref === 'object') {
        ref.current = map.current;
      }

      if (showMapboxControls) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
            showUserHeading: true,
          }),
          'top-right'
        );
      }

      map.current.on('error', () => {
        return;
      });

      const currentMap = map.current;

      currentMap.on('load', () => {
        setMapLoaded(true);
        if (currentMap.isStyleLoaded()) {
          setStyleLoaded(true);
        }
      });

      currentMap.on('style.load', () => {
        setStyleLoaded(true);
      });

      currentMap.on('styledata', () => {
        if (currentMap.isStyleLoaded()) {
          setStyleLoaded(true);
        }
      });

      map.current.on('click', (event) => {
        const clickHandler = onMapClickRef.current;
        if (clickHandler) {
          const { lng, lat } = event.lngLat;
          const currentCoords = { lat, lng };
          const location_xy: [number, number] = [event.point.x, event.point.y];

          if (showCustomMarkerRef.current !== false) {
            const isSameLocation =
              lastClickCoordsRef.current &&
              Math.abs(lastClickCoordsRef.current.lat - lat) < 0.0001 &&
              Math.abs(lastClickCoordsRef.current.lng - lng) < 0.0001;

            if (isSameLocation && currentMarkerRef.current) {
              clearMarker();
            } else {
              updateMarker(lat, lng);
              lastClickCoordsRef.current = currentCoords;
            }
          }

          clickHandler({
            latitude: lat,
            longitude: lng,
            location_xy,
          });
        }
      });

      return () => {
        if (currentMarkerRef.current) {
          currentMarkerRef.current.remove();
        }
        if (userLocationMarker) {
          userLocationMarker.remove();
        }
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        if (currentIconUrlRef.current) {
          URL.revokeObjectURL(currentIconUrlRef.current);
        }
        if (userLocationIconUrl) {
          URL.revokeObjectURL(userLocationIconUrl);
        }
      };
    }, []);

    useEffect(() => {
      if (
        autoGeolocate &&
        map.current &&
        mapLoaded &&
        navigator.geolocation &&
        !hasAutoGeolocated
      ) {
        setHasAutoGeolocated(true);
        setIsGeolocating(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            setUserLocation(latitude, longitude);

            map.current?.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              duration: 1000,
            });

            if (onGeolocate) {
              onGeolocate({
                latitude,
                longitude,
              });
            }
            setIsGeolocating(false);
          },
          () => {
            setIsGeolocating(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      }
    }, [
      autoGeolocate,
      mapLoaded,
      onGeolocate,
      setUserLocation,
      hasAutoGeolocated,
    ]);

    useEffect(() => {
      if (!map.current || !mapLoaded) return;

      const resizeMap = () => {
        if (map.current) {
          map.current.resize();
        }
      };

      const debouncedResize = debounce(resizeMap, 100);

      const resizeObserver = new ResizeObserver(() => {
        debouncedResize();
      });

      if (mapContainer.current) {
        resizeObserver.observe(mapContainer.current);
      }

      return () => {
        resizeObserver.disconnect();
        debouncedResize.cancel();
      };
    }, [mapLoaded]);

    useEffect(() => {
      if (!map.current || !mapLoaded) return;
      if (previousMapSizeRef.current === mapSize) return;
      previousMapSizeRef.current = mapSize;

      const handleMapSizeChange = () => {
        if (!map.current) {
          return;
        }

        if (isTaskDetail || isTasksPage) {
          const currentCenter = map.current.getCenter();
          const currentZoom = map.current.getZoom();
          const currentBearing = map.current.getBearing();
          const currentPitch = map.current.getPitch();

          map.current.resize();

          setTimeout(() => {
            if (map.current) {
              map.current.setCenter(currentCenter);
              map.current.setZoom(currentZoom);
              map.current.setBearing(currentBearing);
              map.current.setPitch(currentPitch);
            }
          }, 10);
        } else {
          const bounds = map.current.getBounds();

          if (bounds) {
            map.current.fitBounds(bounds, {
              padding: { top: 0, bottom: 0, left: 0, right: 0 },
              animate: false,
            });
          }

          map.current.once('idle', () => {
            if (map.current) {
              map.current.resize();
            }
          });
        }
      };

      const timeoutId = setTimeout(handleMapSizeChange, 50);

      return () => clearTimeout(timeoutId);
    }, [mapSize, mapLoaded, isTaskDetail, isTasksPage]);

    const mapComponent = (
      <div
        className={`w-full h-full ${className} relative`}
        style={{ minHeight: '0px' }}
      >
        <div ref={mapContainer} className="w-full h-full" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-2 flex-1 pointer-events-auto">
            {showParcelZoneSelector && (
              <ParcelZoneSelector
                mode={parcelZoneMode}
                onModeChange={handleModeChange}
                showParcelsOption={showParcelsOption}
                showZonesOption={showZonesOption}
              />
            )}

            {showLayerSelector && layerVisibility && (
              <LayerSelector
                layerVisibility={{
                  ...layerVisibility,
                  parcelZoneMode: parcelZoneMode,
                }}
                onLayerVisibilityChange={handleLayerVisibilityChangeInternal}
              />
            )}

            {showSearch && mapboxAccessToken && (
              <div className="flex-1 min-w-0 w-full">
                <MapSearchBar
                  accessToken={mapboxAccessToken}
                  onSearchResult={handleSearchResult}
                  placeholder={searchPlaceholder}
                  initialValue={initialSearchValue}
                />
              </div>
            )}

            {customActionButton && (
              <div className="flex-shrink-0">{customActionButton}</div>
            )}
          </div>

          {showFullscreenButton && (
            <div className="pointer-events-auto">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200 flex-shrink-0"
                onClick={() => {
                  if (map.current) {
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      mapContainer.current?.requestFullscreen();
                    }
                  }
                }}
                title="Toggle fullscreen"
              >
                <span className="material-symbols-outlined text-lg text-basic-black">
                  fullscreen
                </span>
              </Button>
            </div>
          )}
        </div>

        <div
          className={`absolute ${
            hasBottomTimeline ? 'bottom-16' : 'bottom-4'
          } right-4 flex items-end gap-3 z-10`}
        >
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
              onClick={() => {
                if (map.current && navigator.geolocation) {
                  handleGeolocation();
                }
              }}
              disabled={isGeolocating}
              title="Get my location"
            >
              {isGeolocating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              ) : (
                <span className="material-symbols-outlined text-lg text-basic-black">
                  location_searching
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
              onClick={() => {
                if (map.current) {
                  map.current.zoomIn();
                }
              }}
              title="Zoom in"
            >
              <span className="material-symbols-outlined text-lg text-basic-black">
                add
              </span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-9 w-9 border border-gray-200"
              onClick={() => {
                if (map.current) {
                  map.current.zoomOut();
                }
              }}
              title="Zoom out"
            >
              <span className="material-symbols-outlined text-lg text-basic-black">
                check_indeterminate_small
              </span>
            </Button>
          </div>
        </div>

        {!mapboxAccessToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">
                Mapbox Access Token Required
              </div>
              <div className="text-sm">
                Please provide a valid Mapbox access token to display the map
              </div>
            </div>
          </div>
        )}

        {showProgressBar && progressSteps.length > 0 && (
          <div className="absolute top-16 left-4 right-4 mt-1 pointer-events-auto">
            <MapProgressBar
              steps={progressSteps}
              currentStepIndex={currentProgressStep}
              onClose={onProgressBarClose}
            />
          </div>
        )}

        <MapLegend
          title={legendTitle}
          levels={legendLevels}
          show={showLegend}
          position={legendPosition}
          metricConfig={metricConfig}
          metricId={selectedMetricId}
        />

        <MapProvider
          map={map.current}
          mapLoaded={mapLoaded}
          styleLoaded={styleLoaded}
        >
          {parcelZoneMode === 'parcels' && (
            <ParcelsLayer
              parcels={parcels}
              onParcelClick={onParcelClick}
              selectable={enableParcelSelection}
              selectedParcelId={selectedParcelId}
              visible={true}
              showPhColors={showPhColors}
              onlyBorder={false}
              metricConfig={metricConfig}
              parcelStyleVariant={parcelStyleVariant}
            />
          )}
          {/* 
          {parcelZoneMode === 'zones' && showParcelBorderWithZones && (
            <ParcelsLayer
              parcels={parcels}
              onParcelClick={onParcelClick}
              selectable={enableParcelSelection}
              selectedParcelId={selectedParcelId}
              visible={true}
              showPhColors={showPhColors}
              onlyBorder={true}
              metricConfig={metricConfig}
              parcelStyleVariant={parcelStyleVariant}
            />
          )}

          {parcelZoneMode === 'zones' && (
            <ZonesLayer
              zones={zones}
              parcels={parcels}
              onZoneClick={onZoneClick}
              visible={true}
              showZoneLabels={showZoneLabels}
            />
          )} */}

          {children}
        </MapProvider>
      </div>
    );

    if (showSizeControls) {
      return (
        <div
          className={`flex h-full w-full overflow-hidden ${
            panelSide === 'left' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {mapSize > 0 && (
            <div
              className="relative flex-shrink-0 bg-white rounded-xl max-h-full overflow-hidden"
              style={{
                width: `${currentMapSize || mapSize}%`,
                height: '100%',
                minHeight: '400px',
                minWidth:
                  (currentMapSize || mapSize) === 0
                    ? '0px'
                    : (currentMapSize || mapSize) === 30
                    ? '30vw'
                    : (currentMapSize || mapSize) === 40
                    ? '40vw'
                    : 'auto',
              }}
            >
              <MapSizeControls
                currentSize={currentMapSize || mapSize}
                onSizeChange={handleMapSizeChange}
                side={panelSide}
                showFilters={showFilters}
                isTaskDetail={isTaskDetail}
              />
              {mapComponent}
            </div>
          )}
          <div className="flex-1 overflow-hidden min-w-0">
            {/* Content next to the map */}
          </div>
        </div>
      );
    }

    return mapComponent;
  }
);

Map.displayName = 'Map';
