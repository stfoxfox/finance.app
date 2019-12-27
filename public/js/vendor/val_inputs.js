/**
 * Created by Admin on 10.06.16.
 */

function key_val(input){
    var $this = input;
    var count_ch = 65;
    var data_type = input.attr('data-inp-type');
    var data_val = input.val();
    switch (data_type){
        case 'num': {
            var data_val = isNaN(data_val[data_val.length-1]);
            if(data_val){
                $this.val($this.val().substr(0, $this.val().length-1));
            }
            else{

            }
            break;
        }
        case 'txt': {
            if($this.val().length > count_ch){
                $this.val($this.val().substr(0, count_ch));
            }
            break;
        }g
        default : {
            alert('undefined');
        }
    }
}
function val_title(err_message){
    var data_flag = false;
    if($('div[data_investproject_d] input[data_investproject_input]').val().trim() == ""){
        alert(err_message);
        /*$(this).focus();*/
        data_flag = true;
        $(this).css('border','1px solid red');
    }else{
        $(this).css('border','1px dotted #7B7979');
    }
    return data_flag;
}

function toInput(element) {
	var scrollTop = element.offset().top;
	$('html, body').animate({ scrollTop: scrollTop-170 }, 200);
}

function val_submit(sel_empty, num_less, num_more, num_be, num_enter, or ){
    var data_flag = false;
    $('[required=true][data-inp-type]').each(function () {
        if($(this).val().trim() == ""){
            if(!data_flag){
                // alert(sel_empty);

				$('.err-msg').remove();
				$(this).after('<div class="err-msg" style="color: #f26671; font-size: 12px;font-family: \'Open Sans\', sans-serif">'+sel_empty+'</div>');
				toInput($(this));

                /*$(this).focus();*/
                data_flag = true;
            }
            $(this).css('border','1px solid red');
        }else{
            var data_type = $(this).attr('data-inp-type');
            var data_val = parseInt($(this).val());
            switch (data_type){
                case 'num': {
                    if(!isNaN(data_val)){
                        if(data_val > 1000000000){
                            if(!data_flag){
                                // alert(num_less + ' 1000000000');

								$('.err-msg').remove();
								$(this).after('<div class="err-msg" style="color: #f26671; font-size: 12px;font-family: \'Open Sans\', sans-serif">'+num_less+' 1000000000</div>');
								toInput($(this));

                                /*$(this).focus();*/
                                data_flag = true;
                            }
                            $(this).css('border','1px solid red');
                        }else if(data_val>0){
                            var flag_er = false;
                            var data_ceil = Math.ceil(data_val/1)*1;
                            var data_floor = Math.floor(data_val/1)*1;
                            if(data_ceil!=data_val || data_floor!=data_val){
                                flag_er = true;
                                if(!data_flag && flag_er){
                                    // alert(num_be + ' ' +data_floor+' ' + or + ' '+data_ceil);

									$('.err-msg').remove();
									$(this).after('<div class="err-msg" style="color: #f26671; font-size: 12px;font-family: \'Open Sans\', sans-serif">'+num_be + ' ' +data_floor+' ' + or + ' '+data_ceil+'</div>');
									toInput($(this));

                                  /*  $(this).focus();*/
                                    data_flag = true;
                                }
                                $(this).css('border','1px solid red');
                            }else{
                                $(this).css('border','1px solid #CCC');
                            }
                        }else{
                            if(!data_flag){
								// alert(num_more + ' 0');

								$('.err-msg').remove();
								$(this).after('<div class="err-msg" style="color: #f26671; font-size: 12px;font-family: \'Open Sans\', sans-serif">'+num_more + ' 0</div>');
								toInput($(this));

                                // $(this).focus();
                                data_flag = true;
                            }
                            $(this).css('border','1px solid #f26671');
                        }
                    }
                    else{
                        if(!data_flag){
                            // alert(num_enter);

							$('.err-msg').remove();
							$(this).after('<div class="err-msg" style="color: #f26671; font-size: 12px;font-family: \'Open Sans\', sans-serif">'+num_enter+'</div>');
							toInput($(this));

                            /*$(this).focus();*/
                            data_flag = true;
                        }
                        $(this).css('border','1px solid red');
                    }
                    break;
                }
                case 'txt': {
                    if($(this).val().trim() == ""){
                        if(!data_flag){
                            // alert(sel_empty);

							$('.err-msg').remove();
							$(this).after('<div class="err-msg" style="color: #f26671; font-size: 12px;font-family: \'Open Sans\', sans-serif">'+sel_empty+'</div>');
							toInput($(this));

                            /*$(this).focus();*/
                            data_flag = true;
                        }
                        $(this).css('border','1px solid red');
                    }else{
                        $(this).css('border','1px solid #CCC');
                    }
                    break;
                }
                default : {
                    alert('undefined'); break;
                }
            }
        }
    });
    return data_flag;
}
