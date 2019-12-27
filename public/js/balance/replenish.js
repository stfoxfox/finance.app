/* 
 * windrawal.js is a part of project konstruktor-app
 * Created at: 20.00.2017 16:15:56
 * @author Vasiliy.Razumov <1248783@gmail.com>
 */

$(function () {


    $('.replenish-process').submit(function (e) {
        e.preventDefault();
        var serialized = $(this).serialize();
        var form = $(this);
        $.ajax({
            url: '/replenish',
            type: 'POST',
            data: serialized,
            success: function (data) {
                if (data.success) {
                    form[0].reset();
                    alert(data.message);
                    document.location.href = '/';
                } else {
                    alert(data.error);
                }
            }
        });
    });
});