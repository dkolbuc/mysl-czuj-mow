// maps.js — Leaflet map for the clinic location page
(function () {
  'use strict';

  // Coordinates for ul. Karola Olszewskiego 6, Kielce (Przychodnia Chemar)
  var LAT  = 50.8937325;
  var LNG  = 20.6218513;
  var ZOOM = 16;

  function initMap() {
    var container = document.getElementById('clinic-map');
    if (!container || typeof L === 'undefined') return;

    // Guard against double-initialisation
    if (container._leaflet_id) return;

    // Initialise map
    var map = L.map('clinic-map', {
      center: [LAT, LNG],
      zoom: ZOOM,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // OpenStreetMap tile layer (free, attribution required by OSM licence)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);

    // Custom branded marker (divIcon — no image file needed)
    var clinicIcon = L.divIcon({
      className: 'clinic-map-marker',
      html: '<div class="clinic-map-marker__pin" role="img" aria-label="Gabinet Myśl Czuj Mów">' +
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">' +
                '<path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#293a4c"/>' +
                '<circle cx="18" cy="18" r="8" fill="#a98879"/>' +
              '</svg>' +
            '</div>',
      iconSize:    [36, 48],
      iconAnchor:  [18, 48],
      popupAnchor: [0, -52]
    });

    // Place marker with popup
    L.marker([LAT, LNG], { icon: clinicIcon })
      .addTo(map)
      .bindPopup(
        '<div class="map-popup">' +
          '<strong class="map-popup__name">Myśl \u00b7 Czuj \u00b7 M\u00f3w</strong>' +
          '<span class="map-popup__type">Gabinet Terapeutyczny</span>' +
          '<address class="map-popup__address">' +
            'ul. Karola Olszewskiego 6<br>' +
            'I pi\u0119tro, pok. 116<br>' +
            '25-663 Kielce' +
          '</address>' +
          '<a class="map-popup__link" href="https://www.google.com/maps/place/Gabinet+Terapeutyczny+My%C5%9Bl+Czuj+M%C3%B3w/@50.8905874,20.6182778,17z/data=!3m1!4b1!4m6!3m5!1s0x47182706835f6915:0x220a167d04417ac5!8m2!3d50.8905874!4d20.6208527!16s%2Fg%2F11z00_9m6b?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener">Otw\u00f3rz w Google Maps \u2192</a>' +
        '</div>',
        { maxWidth: 240 }
      )
      .openPopup();

    // Recalculate map size after layout settles (fixes blank-tile issue)
    setTimeout(function () { map.invalidateSize(); }, 100);

    // Enable scroll-zoom only while cursor is over the map
    container.addEventListener('click', function () {
      map.scrollWheelZoom.enable();
    });
    container.addEventListener('mouseleave', function () {
      map.scrollWheelZoom.disable();
    });
  }

  // Wait for full page load so the container has its final dimensions
  window.addEventListener('load', initMap);

})();
