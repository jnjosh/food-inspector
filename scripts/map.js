(function ($) {

    'use strict';

    var map,
        userLocation = {
            // use default coordinates for the city of Durham
            lat: 35.9886,
            lng: -78.9072
        },
        locationLayerPath = "data/food-locations.geojson",
        addMarker = function (lat, lng, markerHexColor, markerSymbol, markerSize) {
            var markerInfo = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    properties: {}
                };

            // clean this up at some point
            if (markerHexColor !== undefined) {
                markerInfo.properties['marker-color'] = markerHexColor;
            }

            if (markerSymbol !== undefined) {
                markerInfo.properties['marker-symbol'] = markerSymbol;
            }

            if (markerSize !== undefined) {
                markerInfo.properties['marker-size'] = markerSize;
            }

            L.mapbox.markerLayer(markerInfo).addTo(map);
        },
        getUserLocation = function (callbackFunc) {
            var success = function (position) {
                    userLocation.lat = position.coords.latitude;
                    userLocation.lng = position.coords.longitude;

                    if (callbackFunc !== undefined) {
                        callbackFunc();
                    }
                },
                error = function () {
                    console.log("Something went wrong trying to detect user's location.");
                };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                // add better fallback?
                alert("Please access this site with a browser that supports geolocation");
            }
        },
        initMap = function () {
            var markerLayer = L.mapbox.markerLayer();

            // setup a Code for Durham MapBox account for map?
            map = L.mapbox.map('map', 'tylerpearson.gc56ggok', {zoomControl: false})
                      .setView([userLocation.lat, userLocation.lng], 17);

            new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

            markerLayer.loadURL(locationLayerPath)
                .addTo(map);

            map.markerLayer.on('click', function (e) {
                map.panTo(e.layer.getLatLng());
            });

        },
        init = function () {
            getUserLocation(function () {
                // create map
                initMap();

                // add a marker for the user's detected location
                addMarker(userLocation.lat, userLocation.lng, '#41b649', 'star', 'large');
            });
        };


    $(document).ready(init);

}(jQuery));
