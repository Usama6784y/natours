/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidXNhbWEzODYiLCJhIjoiY2xsZ2twMHBkMDFuNTNkbGlkbTc1MW9teCJ9.BXEsH_o9JdSLBeuXmVtFHQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/usama386/cllgl5foh014401pienck742x',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

// const points = [
//   [74.540925, 32.498338],
//   [74.410567, 31.520484],
// ];

// const key = 'NajVryza8LxPb70i5YDE';
// const attribution = new ol.control.Attribution({
//   collapsible: false,
// });

// const source = new ol.source.TileJSON({
//   url: `https://api.maptiler.com/maps/streets-v2/tiles.json?key=${key}`, // source URL
//   tileSize: 512,
//   crossOrigin: 'anonymous',
// });

// const bounds = ol.extent.boundingExtent(points);
// // Create map
// const map = new ol.Map({
//   layers: [
//     new ol.layer.Tile({
//       source: new ol.source.OSM(),
//     }),
//   ],
//   target: 'map',
//   view: new ol.View({}),
// });
// const view = map.getView();
// view.fit(bounds, { size: map.getSize() });

// // Marker layer
// const markerLayer = new ol.layer.Vector({
//   source: new ol.source.Vector(),
// });

// // Marker style
// const markerStyle = new ol.style.Style({
//   image: new ol.style.Icon({
//     src: 'img/pin.png',
//     scale: 0.25,
//   }),
// });

// // Add markers
// points.forEach((coordinate) => {
//   const point = ol.proj.fromLonLat(coordinate);

//   const feature = new ol.Feature({
//     geometry: new ol.geom.Point(point),
//   });

//   markerLayer.getSource().addFeature(feature);
// });

// // Apply style
// markerLayer.setStyle(markerStyle);

// // Add layer to map
// map.addLayer(markerLayer);
