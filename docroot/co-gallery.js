ko.components.register('gallery-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.observable( params.key );
        self.sort = ko.observable( params.sort );
        self.order = ko.observable( params.order );
        self.search = ko.observable( params.search );
        self.items = ko.observableArray();
        self.items.extend({
                defferred: true,
                gallery: {
                    itemSize: 164,
                    loadItems: function( start, count, callback ) {

                    $.get(API_URI+params.key()+"/nodes" +
                        "?index=" + start +
                        "&count=" + count +
                        "&sort="+params.sort()+
                        "&order="+(params.order()?"asc":"desc")+
                        "&filter="+params.search(),
                        function(data) {
                            console.log( "result retrieved: " + data.nodes.length );
                            ko.utils.arrayPushAll(self.items, data.nodes);
                            //self.items.valueHasMutated();
                            console.log( "items loaded");
                            callback();
                        }
                    );
                },
                viewModel: new AlbumViewModel()
            }
        });
    },
    template:  { element: "gallery-template" }
});
