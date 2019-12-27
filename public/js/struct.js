var Struct = {
	$panel: null, 
	
	initPanel: function (container) {
		Struct.panel = container;
		$(Struct.panel).load(structURL.panel, null, function(){
			$('select.formstyler', Struct.panel).styler();
			
			Struct.initHandlers();
		});
	},
	
	initHandlers: function() {
		$('.b-order-bottom-device .order-device', Struct.panel).click(function(){
			lSubmit = false;
			$('.drop-device-list-cell .select-option input').each(function(){
				if (!lSubmit) {
					lSubmit = parseInt($(this).val()) && true;
				}
			});
			if (lSubmit) {
				$('#devicePanelForm').submit();
			}
		});
	}
}