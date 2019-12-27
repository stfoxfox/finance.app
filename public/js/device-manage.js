var DeviceManage = {
	orderID: null,
	productTypes: null,
	products: null,
	users: null,

	init: function(orderID, productTypes) {
		DeviceManage.orderID = orderID;
		DeviceManage.productTypes = productTypes;

		$.post(structURL.distrib, {data: {order_id: DeviceManage.orderID}}, function(response){
			if (checkJson(response)) {
				DeviceManage.products = response.data.products;
				DeviceManage.render(response.data.users, response.data.distributed);

				DeviceManage.activate();

				DeviceManage.initHandlers();
			}
		});

	},

	initHandlers: function() {
		var $form = $('.devices-add form');
		$('button', $form).click(function(){
			if ($('input', $form).val()) {
				$.post($form.prop('action'), $form.serialize(), function(response){
					$('.devices-add .groupAccess').html(response);
				});
			}
		});
		$('.devices-size input').keyup(function(){
			DeviceManage.hideErrMsg();
		});
	},

	render: function(users, products) {
		var html = '';
		for(var typeID in DeviceManage.productTypes) {
			if (products[typeID]) {
				html+= tmpl('distributed-products', {productType: DeviceManage.productTypes[typeID], products: products, users: users});
			}
		}
		$('.distributedProducts').html(html);
	},

	getMaxQty: function(id) {
		return (DeviceManage.products[id]) ? DeviceManage.products[id].length : 0;
	},

	activate: function(id) {
		var maxQty, serial;

		if (!id) {
			var aTypeID = Object.keys(DeviceManage.products);
			for(var i = 0; i < aTypeID.length; i++) {
				maxQty = DeviceManage.getMaxQty(aTypeID[i]);
				if (maxQty) {
					id = aTypeID[i];
					break;
				}
			}
		}
		$('.deviceType').removeClass('active');
		maxQty = 0;
		serial = '-';
		if (id) {
			maxQty = DeviceManage.getMaxQty(id);
			if (maxQty) {
				serial = DeviceManage.products[id][0].Product.serial;
			}
		}
		$('#deviceType_' + id).addClass('active');
		$('.devicesLeft').html(maxQty);
		$('.devices-add-sub .id').html('id: ' + serial);
	},

	getActiveType: function() {
		return ($('.deviceType.active').length) ? $('.deviceType.active').prop('id').replace(/deviceType_/, '') : '';
	},

	checkQty: function() {
		var qty = $('.devices-size input').val();
		id = DeviceManage.getActiveType();
		var maxQty = DeviceManage.getMaxQty(id);
		var error = '';
		if (!maxQty) {
			error = errMsg3;
		} else if (!parseInt(qty)) {
			error = errMsg2;
		} else if (qty > maxQty) {
			error = errMsg.replace(/~n/, maxQty);
		}
		if (error) {
			DeviceManage.showErrMsg(error);
			return false;
		}
		DeviceManage.hideErrMsg();
		return true;
	},

	showErrMsg: function(msg) {
		var $errMsg = $('.devices-size .help-text');
		$errMsg.html(msg);
		$errMsg.show();
		$('.devices-size input').addClass('error');
		$('.devices-size input').focus();
		$('.devices-size input').select();
	},

	hideErrMsg: function() {
		$('.devices-size .help-text').hide();
		$('.devices-size input').removeClass('error');
	},

	distribProducts: function(userID) {
		// var val = $('.devices-size input').val();
		if (DeviceManage.checkQty()) {
			typeID = DeviceManage.getActiveType();
			var qty = $('.devices-size input').val();
			var aProd = [];
			for(var i = 0; i < qty; i++) {
				product = DeviceManage.products[typeID][i].Product;
				aProd.push(product.id);
			}
			$.post(structURL.distrib, {data: {order_id: DeviceManage.orderID, products: aProd, user_id: userID}}, function(response){
				if (checkJson(response)) {
					DeviceManage.products = response.data.products;
					DeviceManage.render(response.data.users, response.data.distributed);
					DeviceManage.activate(DeviceManage.getActiveType());
				}
			});
		}
	},

	giveBack: function(productID) {
		$.post(structURL.distrib, {data: {order_id: DeviceManage.orderID, products: [productID], user_id: 0}}, function(response){
			if (checkJson(response)) {
				DeviceManage.products = response.data.products;
				DeviceManage.render(response.data.users, response.data.distributed);
			}
		});
	},

	block: function(productID, blocked) {
		$.post(structURL.block, {data: {order_id: DeviceManage.orderID, products: [productID], blocked: blocked}}, function(response){
			if (checkJson(response)) {
				DeviceManage.products = response.data.products;
				DeviceManage.render(response.data.users, response.data.distributed);
			}
		});
	}
};
