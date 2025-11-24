(() => {
  const token = window.MAPBOX_TOKEN;
  const mapContainer = document.getElementById('map');

  if (!token) {
    mapContainer.innerHTML =
      '<div class="map-error">Set the MAPBOX_TOKEN environment variable to load the live map.</div>';
    return;
  }

  mapboxgl.accessToken = token;

  const center = [-120.0605, 36.335];

  const farmPolygon = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Parcela Oeste' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-120.0765, 36.3438],
              [-120.0465, 36.3438],
              [-120.0465, 36.3262],
              [-120.0765, 36.3262],
              [-120.0765, 36.3438]
            ]
          ]
        }
      }
    ]
  };

  const hotspots = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { category: 'stress' },
        geometry: { type: 'Point', coordinates: [-120.066, 36.3375] }
      },
      {
        type: 'Feature',
        properties: { category: 'stress' },
        geometry: { type: 'Point', coordinates: [-120.058, 36.3315] }
      },
      {
        type: 'Feature',
        properties: { category: 'ok' },
        geometry: { type: 'Point', coordinates: [-120.054, 36.3395] }
      }
    ]
  };

  const droneRoute = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-120.075, 36.327],
        [-120.065, 36.327],
        [-120.053, 36.3285],
        [-120.048, 36.335],
        [-120.050, 36.3415],
        [-120.061, 36.343],
        [-120.072, 36.341],
        [-120.074, 36.333],
        [-120.068, 36.3295],
        [-120.075, 36.327]
      ]
    }
  };

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center,
    zoom: 13.2,
    pitch: 50,
    bearing: 12
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

  map.on('load', () => {
    map.addSource('farm', { type: 'geojson', data: farmPolygon });
    map.addLayer({
      id: 'farm-fill',
      type: 'fill',
      source: 'farm',
      paint: {
        'fill-color': '#18ffb4',
        'fill-opacity': 0.18
      }
    });

    map.addLayer({
      id: 'farm-outline',
      type: 'line',
      source: 'farm',
      paint: {
        'line-color': '#7ec6ff',
        'line-width': 2
      }
    });

    map.addSource('hotspots', { type: 'geojson', data: hotspots });
    map.addLayer({
      id: 'hotspots-layer',
      type: 'circle',
      source: 'hotspots',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'pulse'],
          0,
          6,
          1,
          12
        ],
        'circle-color': [
          'match',
          ['get', 'category'],
          'stress',
          '#ffd479',
          '#7af5c8'
        ],
        'circle-blur': 0.3,
        'circle-opacity': 0.8
      }
    });

    map.addSource('drone-route', { type: 'geojson', data: droneRoute });
    map.addLayer({
      id: 'drone-route-layer',
      type: 'line',
      source: 'drone-route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-width': 3,
        'line-gradient': [
          'interpolate',
          ['linear'],
          ['line-progress'],
          0,
          '#7ec6ff',
          0.5,
          '#18ffb4',
          1,
          '#7ec6ff'
        ]
      }
    });

    map.addSource('drone-point', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: droneRoute.geometry.coordinates[0]
        }
      }
    });
    map.addLayer({
      id: 'drone-point-layer',
      type: 'circle',
      source: 'drone-point',
      paint: {
        'circle-radius': 7,
        'circle-color': '#7ec6ff',
        'circle-stroke-color': '#001018',
        'circle-stroke-width': 2,
        'circle-opacity': 0.9
      }
    });

    animateLayers(map);
  });

  const animateLayers = (mapInstance) => {
    let pulse = 0;
    let direction = 1;
    let routeIndex = 0;

    const step = () => {
      pulse += 0.04 * direction;
      if (pulse >= 1 || pulse <= 0) {
        direction *= -1;
      }

      const hotSource = mapInstance.getSource('hotspots');
      if (hotSource) {
        const animated = {
          ...hotspots,
          features: hotspots.features.map((f) => ({
            ...f,
            properties: { ...f.properties, pulse: pulse }
          }))
        };
        hotSource.setData(animated);
      }

      const pointSource = mapInstance.getSource('drone-point');
      if (pointSource) {
        routeIndex = (routeIndex + 1) % droneRoute.geometry.coordinates.length;
        pointSource.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: droneRoute.geometry.coordinates[routeIndex]
          }
        });
      }

      if (routeIndex % 40 === 0) {
        mapInstance.easeTo({
          center: droneRoute.geometry.coordinates[routeIndex],
          bearing: mapInstance.getBearing() + 3,
          duration: 1600,
          pitch: 60,
          easing: (t) => t
        });
      }

      requestAnimationFrame(step);
    };

    step();
  };
})();
