ko.components.register('artist-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.observable();
        self.cls = ko.observable();
        self.artist = ko.observable();

        self.artists = ko.observableArray();

        self.url = function(node) {
            return ko.computed( function() {
                return "/res/" + node.key + node.ext;
            })
        };

        self.thumbnail = function( node ) {
            return ko.computed( function() {
                return "/cds/tn_" + node.key + ".jpg";
            })
        };

        self.key = ko.computed({
            read: function () {
                $.getJSON( "/cds/"+params.key() + "/nodes", function( data ) {
                    self.artists([]);
                    for (var k = 0; k < data.nodes.length; k++) {
                        self.artists.push(data.nodes[k]);
                    }
                } );

                return params.key();
            },
            write: function (data) {}
        });
    },
    template:
'<span data-bind"text:key"/><div class="card">\
   <div class="artist text-muted">\
     <div class="container" id="content" data-bind="foreach:artists">\
         <div data-bind="component: { \
             name: cls, \
             params: { object: $data }}"> \
         </div> \
     </div>\
</div>'
});
