ko.components.register('movie-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.observable(params.key);
        self.movie = params.node;
        self.movies= params.nodes;

        self.url = function(node) {
            return ko.computed( function() {
                return API_URI+"/res/" + node.key + node.ext;
            })
        };

        self.thumbnail = function( node ) {
            return ko.computed( function() {
                return API_URI+"/img/tn_" + node.key + ".jpg";
            })
        };

//        self.key = ko.computed({
//            read: function () {
//                console.log( "load movie-page-widget: " + params.key() );
//                $.getJSON( API_URI+params.key()+"/nodes", function( data ) {
//                    console.log( "load movies: " + params.key )
//                    self.movies([]);
//                    for (var k = 0; k < data.length; k++) {
//                        self.movies.push(data[k]);
//                    }
//                } );

//                return params.key();
//            },
//            write: function (data) {}
//        });
    },
    template:
'<div class="panel-body">\
        <div data-bind="foreach: {data: movies}">\
            <span data-bind="text: name"/>\
            <span data-bind="text: key"/>\
            <span data-bind="text: comment"/>\
        </div> \
    </div>\
    FOLDERS: <div data-bind="foreach: {data: folders}">\
        <span data-bind="text: name"></span>\
    </div>\
    FULES: <div data-bind="foreach: {data: files}">\
        <span data-bind="text: name"></span>\
    </div>\
</div>'
});
