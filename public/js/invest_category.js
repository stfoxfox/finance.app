var InvestCategory = {
    panel: null,

    initPanel: function (container) {
        InvestCategory.panel = container;
        $(InvestCategory.panel).load(investURL.panel, null, function(){
            InvestCategory.initHandlers();
        });
    },

    initHandlers: function() {
    }
}