var Finance = {
	panel: null,
	container: null,

	initPanel: function (container) {
		if (!container) {
			container = Finance.container;
		} else {
			Finance.container = container;
		}
		Finance.panel = container;
		$(Finance.panel).load(financeURL.panel);
	}
}