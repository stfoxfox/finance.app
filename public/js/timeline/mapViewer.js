function gMapsViewer(element, options){
    this.instance = element;
    this.options = $.extend(
        {
            editable: false,
        },
        options);

    this.map_ev = undefined;
    this.geocoder_ev = new google.maps.Geocoder();
    this.marker_ev = undefined;
}

gMapsViewer.prototype.setEditable = function(editable){
    if(!this.map_ev) return;

    this.options.editable = editable;
    var closure = this;

    var listener = function(event) {
        closure.placeMarker(event.latLng, true);
    };

    if(this.options.editable){
        google.maps.event.addListener(this.map_ev, 'click', listener);
    }

    google.maps.event.trigger(this.map_ev, 'resize');
}

gMapsViewer.prototype.placeMarker = function(location, reverse){
    var closure = this;
    if ( this.marker_ev ) {
        if(!this.options.editable) return;
        this.marker_ev.setPosition(location);
    } else {
        this.marker_ev = new google.maps.Marker({
            position: location,
            map: closure.map_ev
        });
    }

    this.codeLatLngEd(location, reverse);
};

gMapsViewer.prototype.codeLatLngEd = function(latlng, flag){
    var closure = this;

    this.geocoder_ev.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                var changeAddress = new CustomEvent('gMaps.change', { 'detail': {
                    sender: closure,
                    address: results[1].formatted_address,
                    location: latlng,
                    mode: flag
                } });

                closure.instance.each(function(){
                    this.dispatchEvent(changeAddress);
                });

            } else {
                alert('No results found');
            }
        } else {
            alert('Geocoder failed due to: ' + status);
        }
    });
}

gMapsViewer.prototype.SetAddress = function(place){
    var closure = this;

    if(place) {
        this.geocoder_ev.geocode( { 'address': place}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if(!closure.map_ev) {
                    closure.map_ev = new google.maps.Map($(closure.options.canvas)[0], {
                        zoom: 13,
                        center: results[0].geometry.location,
                        disableDefaultUI: true
                    });

                    closure.marker_ev = undefined;
                    closure.setEditable(closure.options.editable);
                }

                closure.map_ev.setCenter(results[0].geometry.location);
                closure.placeMarker(results[0].geometry.location, false);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

gMapsViewer.prototype.Refresh = function(){
    if(this.map_ev){
        google.maps.event.trigger(this.map_ev, 'resize');
    }
}

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
