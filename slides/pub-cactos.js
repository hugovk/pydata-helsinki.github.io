let map;

// TODO: Verify exact coordinates for Sofia Helsinki and Marga pub
// Sofia Helsinki is at Sofiankatu 4, 00170 Helsinki
// Marga is in the same building as Sofia Helsinki
const markers = [
  { lng: 24.9403, lat: 60.1628, name: 'Sofia Helsinki', offset: [0, 0] },
  { lng: 24.9403, lat: 60.1628, name: 'Marga', offset: [12, 0] },
];

const zoom = 16;

function addMarker(lng, lat, name, offset) {
  const el = document.createElement('div');
  el.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style="width: 20px; height: 20px; background-color: red; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      <div style="background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 20px; font-weight: bold; color: #333; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${name}</div>
    </div>
  `;

  new maplibregl.Marker({ element: el, anchor: 'left' })
    .setOffset(offset)
    .setLngLat([lng, lat ])
    .setPopup(new maplibregl.Popup().setHTML('<strong>${name}</strong>'))
    .addTo(map);
}

function initMap() {
  if (map) return;

  const vector_sum = markers.reduce((acc, marker) => {
    return {
      lng: acc.lng + marker.lng,
      lat: acc.lat + marker.lat,
    };
  }, { lng: 0, lat: 0 });
  const center = [vector_sum.lng / markers.length, vector_sum.lat / markers.length];

  map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center,
    zoom,
    container: 'map'
  });

  map.on('load', () => {

    map.resize();

    for (const marker of markers) {
      addMarker(marker.lng, marker.lat, marker.name, marker.offset);
    }
  });


}

Reveal.on('ready', () => {
  if (document.getElementById('map')) {
    initMap();
    requestAnimationFrame(() => map.resize());
  }
});

Reveal.on('slidechanged', (e) => {
  if (e.currentSlide.querySelector('#map')) {
    initMap();
    requestAnimationFrame(() => map.resize());
  }
});

Reveal.on('resize', () => {
  if (map) map.resize();
});
