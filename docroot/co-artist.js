ko.components.register('artist-widget', {
    viewModel: function(params) {
        var self = this;
        self.sort = ko.observable( params.sort );
        self.order = ko.observable( params.order );
        self.search = ko.observable( params.search );

        self.artists = ko.observableArray();
        self.items = ko.observableArray();
        $.get(API_URI+"artist/nodes",
            function(data) {
                console.log( "result retrieved: " + data.nodes.length );
                ko.utils.arrayPushAll(self.items, data.nodes);
                //self.items.valueHasMutated();
                console.log( "items loaded");
                callback();
            }
        );
    },
    template:  { element: "artist-template" }
});
