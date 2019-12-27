var Search = {
    panel: null,

    initPanel: function (container, params) {
        if( params == 'undefined' ) {
            params = null;
        }
        Search.panel = container;
        $(Search.panel).load(profileURL.panel, params, function(){
            Search.initHandlers();
        });
    },

    initHandlers: function() {
        $('#searchUserForm').ajaxForm({
            url: profileURL.panel,
            target: Search.panel,
            success: function() {
                Search.initHandlers();
                $(Search.panel).trigger("search:drawn");
            }
        });
    }
}
