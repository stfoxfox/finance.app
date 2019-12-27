$.fn.extend({
    donetyping: function(callback,timeout){
        timeout = timeout || 1e3;
        var timeoutReference,
            doneTyping = function(el){
                if (!timeoutReference) return;
                timeoutReference = null;
                callback.call(el);
            };
        return this.each(function(i,el){
            var $el = $(el);
            $el.is(':input') && $el.on('keyup keypress',function(e){
                if (e.type=='keyup' && e.keyCode!=8) return;
                if (timeoutReference) clearTimeout(timeoutReference);
                timeoutReference = setTimeout(function(){
                    doneTyping(el);
                }, timeout);
            }).on('blur',function(){
                doneTyping(el);
            });
        });
    }
});

var geocoder_ev = [];
var marker;
var map;
var geocoder = new google.maps.Geocoder();
var mapInitialized = false;

function initializeMap( location ) {
    mapInitialized = true;
    map = new google.maps.Map(document.getElementById('kEventCanvas'), {
        zoom: 13,
        center: location,
        disableDefaultUI: true
    });
    marker = undefined;
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng, true);
    });
    google.maps.event.trigger(map, 'resize');
}

//Реверсивная геолокация
function placeMarker(location, reverse) {
    if ( marker ) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    }
    $('#kPlaceCoords').val(location).change();
    if(reverse) {
        codeLatLng(location);
    }
}

function codeAddress(place) {
    if(place) {
        geocoder.geocode( { 'address': place}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if(!mapInitialized) {
                    initializeMap(results[0].geometry.location);
                }
                map.setCenter(results[0].geometry.location);
                placeMarker(results[0].geometry.location, false);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

function coordAddress(LatLng) {
    if(!mapInitialized) {
        initializeMap(LatLng);
    }
    map.setCenter(LatLng);
    placeMarker(LatLng, false);
}

function codeLatLng(latlng) {
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                $('#UserEventPlaceName').val(results[1].formatted_address);
                $("#kPlace").Instancer("update");
            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}