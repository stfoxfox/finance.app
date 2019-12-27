var activeInput = '';

function TestString(str, sLen) {
    return ((str.length >= sLen) && (/[a-zA-Z]/.test(str) || /[а-яА-Я]/.test(str)))
}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) && TestString(email, 8);
}

function updatePass() {
    var enabled = IsEmail($('#passwdMail').val());
    if (enabled) {
        if ($('#passwdReset').hasClass('disabled')) {
            $('#passwdReset').removeClass('disabled');
        }
    } else {
        if (!$('#passwdReset').hasClass('disabled')) {
            $('#passwdReset').addClass('disabled');
        }
    }
}

function updateReg() {
    var UserName = $('#UserName').val();
    UserName = UserName.toLowerCase().replace(/^(.)|\s(.)/g, function (letter) {
        return letter.toUpperCase();
    });
    $('#UserName').val(UserName);

    var UserSurname = $('#UserSurname').val();
    UserSurname = UserSurname.toLowerCase().replace(/^(.)|\s(.)/g, function (letter) {
        return letter.toUpperCase();
    });
    $('#UserSurname').val(UserSurname);
}

$(document).ready(function () {
    $('.form-control').bind("keyup change", function () {
        //updatePass();
        //updateAuth();
        if($(this).parents('#VacancyPopup').length) {
            return false;
        }
        updateReg();

        $(this).popover('hide');
        $('input', $(this)).popover('hide');
    });

    $('#terms').on('show.bs.modal', function (e) {
        $('.terms').css('overflow', 'hidden');
    });
    $('#terms').on('shown.bs.modal', function (e) {
        setTimeout((function () {
            $('.terms').css('overflow', '');
            $('.terms').niceScroll({cursorwidth: "7px", cursorcolor: "#23b5ae", cursorborder: "none", autohidemode: "false", background: "#f1f1f1"})
            $('.terms').getNiceScroll().show();
        }), 400);
    })

    $('#terms').on('hide.bs.modal', function (e) {
        $('.terms').getNiceScroll().hide();
    });

});

/**
 * Init Location
 * @type Function
 * @author Nezhidaev Evgneiy dareks84@gmail.com
 * @return {Object}
 */
var initLocation = function () {

    var myLocation; // global variable to store lat/lng

    var setLocation = function (location) {
        myLocation = location;
        onSetLocation();
    };

    var onSetLocation = function () {
        //save location data to hidden registration fields
        $('#UserLat').val(myLocation.lat);
        $('#UserLoginLat').val(myLocation.lat);
        $('#UserLng').val(myLocation.lng);
        $('#UserLoginLng').val(myLocation.lng);
    };

    var init = function () {
        if (navigator && navigator.geolocation) {
            // HTML5 GeoLocation
            function getLocation(position) {
                setLocation({
                    "lat": position.coords.latitude,
                    "lng": position.coords.longitude
                });
            }
            navigator.geolocation.getCurrentPosition(getLocation);
        } else {
            // Google AJAX API fallback GeoLocation
            if ((typeof google == 'object') && google.loader && google.loader.ClientLocation) {
                setLocation({
                    "lat": google.loader.ClientLocation.latitude,
                    "lng": google.loader.ClientLocation.longitude
                });
            }
        }
    };

    return {
        init: function () {
            init();
        },
        getLocation: function () {
            return myLocation;
        }
    };
}();
initLocation.init();
