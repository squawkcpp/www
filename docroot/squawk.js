ko.components.register('sort-widget', {
    viewModel: function(params) {
        this.sortKeys = params.sortKeys;
    },
template: '<div class="dropdown">\
 <a href="#" class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-bind="text: $root.sort()"></a>\
 <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" data-bind="foreach: sortKeys">\
   <a class="dropdown-item" href="#" data-bind="click: function() { $root.sort( $data ) }, text: $data"></a>\
 </div>\
</div>'
});

ko.components.register('order-widget', {
    viewModel: function(params) {
        this.order = params.order;
        this.style = params.style;
    },
    template: '<span class="fa" aria-hidden="true" data-bind="click: function() { $root.do_order() }, css: style"></span>'
});


// ------------------------------------------------------------------------------------------------
// --- Gallery View Models                                                                      ---
// ------------------------------------------------------------------------------------------------
/* function ArtistViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
    }
} */


// ------------------------------------------------------------------------------------------------
// --- Application View Model                                                                   ---
// ------------------------------------------------------------------------------------------------
function SquawkViewModel() {
    var self = this;

    self.main = ko.observable( 'gallery-widget' );
    ko.extenders.viewChange = function(target, option) {
        console.log( "view change: " + option );
        target.subscribe(function(newValue) {
            console.log( "load nodes and sort key for: " + self.key() + ", type: " + self.key() + ", target:"+ target() + ", option:" + option );

            if( self.key() == 'admin' ) {
                self.main( 'admin-widget' );
            } else if( self.key() == 'artist' ) {
                self.main( 'artist-widget' );
            } else self.main( 'gallery-widget' );

//            self.items.removeAll();

//            if( self.key() == "artist" ) self.viewModel( "artist-gallery-template" );
//            else self.viewModel( "album-gallery-template" );

//            if( self.key() == "album" ) {
//                self.items.gallery.reset( new AlbumViewModel() );
//            } else if( self.key() == "artist" ) {
//                self.items.gallery.reset( new ArtistViewModel() );
//            } else if( self.key() == "ebook" ) {
//                self.items.gallery.reset( new EBookViewModel() );
//            } else if( self.key() == "photo" ) {
//                self.items.gallery.reset( new PhotoViewModel() );
//            } else if( self.key() == "movie" ) {
//                self.items.gallery.reset( new MovieViewModel() );
//            } else if( self.key() == "serie" ) {
 //               self.items.gallery.reset( new SerieViewModel() );
//            } else if( self.key() == "storage" ) {
//                self.items.gallery.reset( new StorageViewModel() );
//            }
        });
    };

    self.key = ko.observable( "album" ).extend( {viewChange: "key"} );
    self.navigation_nodes = ko.observableArray();

    self.sort = ko.observable( "alpha" ).extend( {viewChange: "sort"} );
    self.sortKeys = ko.observableArray();
    self.order = ko.observable( false ).extend( {viewChange: "order"} );
    self.orderStyle = ko.observable( "fa-sort-amount-asc" );
    self.search = ko.observable( "" ).extend( {viewChange: "search"} );
    self.viewModel = ko.observable( "album-gallery-template" );

    // list expand functions

    //change order
    self.do_order = function() {
        self.order( !self.order() );
        if( self.order() ) {
            self.orderStyle( "fa-sort-amount-asc" );
        } else {
            self.orderStyle( "fa-sort-amount-desc" );
        }
    };
    //autocomplete input
    self.getOptions = function(searchTerm, callback) {
        $.ajax({
          dataType: "json",
          url: API_URI+"/sug/"+searchTerm,
        }).done(callback);
    };

    //load root nodes
    $.get(API_URI+"/root/nodes", function(data) {
        ko.utils.arrayPushAll(self.navigation_nodes, data.nodes);
    });
}

ko.applyBindings(new SquawkViewModel());

