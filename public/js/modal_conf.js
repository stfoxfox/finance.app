$(document).ready(function () {
    $('.modal').on('shown.bs.modal', function (e) {
        $('body').css("position","fixed");
    })
    $('.modal').on('hide.bs.modal', function (e) {
        $('body').css("position","static");
    });
});