var Note = {
	panel: null,
	container: null,

	initPanel: function (container, id) {
		if (!container) {
			container = Note.container;
		} else {
			Note.container = container;
		}
		Note.panel = container;
		$(Note.panel).load(noteURL.panel, {id: id});
	}
}