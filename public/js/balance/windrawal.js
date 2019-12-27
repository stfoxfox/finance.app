/* 
 * windrawal.js is a part of project konstruktor-app
 * Created at: 20.00.2017 16:15:56
 * @author Vasiliy.Razumov <1248783@gmail.com>
 */

$(function () {
    $('.wiring-connect').click(function (e) {
        e.preventDefault();
        var wallet = $(this).data('wallet');
        var type = $(this).data('type');
        var clone = $('.wiring-wallet-modal').clone(true, true);
        $.ajax({
            url: '/get-wallet',
            type: 'POST',
            data: {
                type: type
            },
            success: function (data) {
                clone.modal('show');
                clone.on('shown.bs.modal', function () {
                    var modal = $(this).find('.modal-content');
                    modal.html(modal.html().replace(/{wallet}/g, wallet));
                    modal.html(modal.html().replace(/{type}/g, type));
                    modal.find('#wallet_form_wallet').val(data.wallet);
                    modal.find('#wallet_form_type').val(type);
                    
                });
                clone.on('hidden.bs.modal', function () {
                    $(this).data('modal', null);
                    clone.remove();
                });
            }
        });
    });

    $('body').on('submit', '.wallet-form', function (e) {
        e.preventDefault();
        var serialized = $(this).serialize();
        $.ajax({
            url: '/save-wallet',
            type: 'POST',
            data: serialized,
            success: function (data) {
                if (data.success) {
                    $('.modal .close').click();
                    document.location.reload();
                } else {
                    alert(data.error);
                }
            }
        });
    });

    $('.windrawal-process').submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var wallet_id = null;
        $('input[name="wallet_id"]').each(function () {
            if ($(this).is(':checked')) {
                wallet_id = $(this).val();
            }
        });
        $.ajax({
            url: '/windrawal-process',
            type: 'POST',
            data: {
                amount: form.find('input[name="amount"]').val(),
                smscode: form.find('input[name="smscode"]').val(),
                wallet_id: wallet_id
            },
            success: function (data) {
                if (data.success) {
                    form[0].reset();
                    alert(data.message);
                    document.location.href ='/';
                } else {
                    alert(data.error);
                }
            }
        });
    });
    
    $('.windrawal-process input').change(function(){
        if(checkForm($(this))) {
            $(this).parents('.windrawal-process').find('input[type="submit"]').removeAttr('disabled');
        } else {
            $(this).parents('.windrawal-process').find('input[type="submit"]').attr('disabled', 'disabled');
        }
    });

    $('body').on('click', 'button[data-submit="wallet-form"]', function (e) {
        e.preventDefault();
        $(this).parents('.modal-content').find('.wallet-form').submit();
    });

    $('.send-smscode').click(function(){
        $.ajax({
            url: '/send-sms',
            type: 'POST',
            
            success: function (data) {
                if (data.success) {
                    alert(data.code);
                } else {
                    alert(data.error);
                }
            }
        });
    });
});

function checkForm(field) {
    var wallet_id = false;
    var form = field.parents(form);
    $('input[name="wallet_id"]').each(function () {
        if ($(this).is(':checked')) {
            wallet_id = $(this).val();
        }
    });
    if (!wallet_id) {
        return false;
    }
    if (parseInt(form.find('input[name="amount"]').val()) < 0) {
        return false;
    }
    if(!form.find('input[name="smscode"]').val()) {
        return false;
    }
    return true;
}