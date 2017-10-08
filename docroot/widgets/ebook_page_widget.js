ko.components.register('ebook-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.observable();
        self.cls = ko.observable();
        self.mime_type = ko.observable();
        self.name = ko.observable();
        self.publisher = ko.observable();
        self.comment = ko.observable();
        self.thumb = ko.observable();
        self.author = ko.observable();
        self.isbn = ko.observable();
        self.date = ko.observable();

        self.url = function(node) {
            return ko.computed( function() {
                console.log( "url: " + "/res/" + node + node.ext );
                return "/res/" + node + node.ext;
            })
        };

        self.thumbnail = function( node ) {
            return ko.computed( function() {
                console.log( "tn: " + API_URI+"/img/tn_" + node + ".jpg" );
                return API_URI+"/img/tn_" + node + ".jpg";
            })
        };

//        self.key = ko.computed({
//            read: function () {
//                console.log( "load ebook: " + params.key() );
//                $.getJSON( API_URI+params.key(), function( data ) {
//                    self.key = data.key;
//                    self.cls = data.cls;
//                    self.mime_type( data.mimeType );
//                    self.name( data.name );
//                    self.publisher( data.publisher );
//                    self.comment( data.comment );
//                    self.thumb( data.thumb );
//                    self.author( data.author );
//                    self.isbn( data.isbn );
//                    self.date( data.data );
//                } );

//                return params.key();
//            },
//            write: function (data) {}
//        });
    },
    template:
'<div class="media">\
    <img data-bind="attr: { src: API_URI+thumb(), title: name }"/>\
    <a data-bind="attr: { href: url, title: name }">\
        <p class="card-text" data-bind="text:name" /></p>\
   </a>\
    <p data-bind="text: comment"/> \
</div>'
});
