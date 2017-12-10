var API_URI="http://192.168.0.1:9001/";

function AlbumViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.artist = ko.observable();
    self.year = ko.observable();
    self.thumb = ko.observable();
    self.med = ko.observable();
    self.audiofiles = ko.observableArray();
    self.covers = ko.observableArray();

    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
        self.artist(data.artist);
        self.year(data.year);
        self.thumb(data.thumb);
        self.med(data.med);

        $.getJSON( API_URI+self.key()+"/type/audio", function( data ) {
            self.audiofiles([]);
            ko.utils.arrayPushAll(self.audiofiles, data.nodes );
        });
        $.getJSON( API_URI+self.key()+"/type/image", function( data ) {
            self.covers([]);
            ko.utils.arrayPushAll(self.covers, data.nodes );
        });
        ko.renderTemplate("album-template", self, {}, element, "replaceChildren");
        setTimeout( function() {
            $('#gallery').lightGallery();
        }, 2000 );
    }
}

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
// --- Application View Model                                                                   ---
// ------------------------------------------------------------------------------------------------
function SquawkViewModel() {
    var self = this;

    // list expand functions
    self.items = ko.observableArray();
    self.items.extend({
        gallery: {
            itemSize: 164,
            loadItems: function( start, count, callback ) {
                $.get( API_URI+"album/nodes" +
                      "?index=" + start + "&count="+ count,
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

    ko.extenders.viewChange = function(target, option) {
        target.subscribe(function(newValue) {
            console.log( "load nodes and sort key for: " + self.key() + ", type: " + self.key() + ", target:"+ target() + ", option:" + option );
            if( self.key() == "album" ) {
                self.gallery( new GalleryModel() );
            }
        });
    };

    self.key = ko.observable().extend( {viewChange: "key"} );
    //self.items = ko.observableArray();

    self.navigation_nodes = ko.observableArray();
    self.sort = ko.observable( "alpha" ).extend( {viewChange: "sort"} );
    self.sortKeys = ko.observableArray();
    self.order = ko.observable( false ).extend( {viewChange: "order"} );
    self.orderStyle = ko.observable( "fa-sort-amount-asc" );

    //load root nodes
    $.get(API_URI+"/root/nodes", function(data) {
        ko.utils.arrayPushAll(self.navigation_nodes, data.nodes);
    });
}

ko.applyBindings(new SquawkViewModel());

