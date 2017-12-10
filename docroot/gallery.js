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


// ------------------------------------------------------------------------------------------------
// --- Application View Model                                                                   ---
// ------------------------------------------------------------------------------------------------
function GalleryModel() {
    var self = this;

    self.loading = false;
    self.itemSize = ko.observable(164);
    self.numItemsPerPage = ko.observable();
    self.firstHiddenIndex = ko.observable();
    self.numItemsPerLine = ko.observable(6);
    self.numLines = ko.observable();
    self.firstVisibleIndex = ko.observable(0);
    self.itemsLoaded = ko.observable(0);

    self.windowWidth = ko.observable(6);
    self.windowHeight = ko.observable();
    self.scrollY = ko.observable(0);

    self.items = ko.observableArray();

    function windowSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];
        self.windowWidth( w.innerWidth || e.clientWidth || g.clientWidth );
        self.windowHeight( w.innderHeight|| e.clientHeight|| g.clientHeight );

        self.numItemsPerLine( Math.floor( self.windowWidth() / self.itemSize() ) );
//        self.numLines( data.count / self.numItemsPerLine() );
        self.numItemsPerPage( ( Math.ceil( self.windowHeight() / self.itemSize() ) ) * self.numItemsPerLine() );
        //self.items([]);
    }

    // detect resize
    $(window).resize(function() {
        windowSize();
    });

    // tell infinte-scroll about the current scroll position
    // (debounce is important for ie11 smooth scroll problems! and also generally nicer in all browsers)
    $(window).scroll(function() {
        self.scrollY($(window).scrollTop());
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        if( scrollBottom < 100 ) {
            populateItems( self.numItemsPerLine );
        }
    });

    // init items
    function populateItems(count) {
        if( !self.loading ) {

            self.loading = true;
            var oldItemsLoaded = self.itemsLoaded();
            self.itemsLoaded( self.itemsLoaded() + count() );
            $.get( API_URI+"album/nodes" +
                  "?index=" + oldItemsLoaded + //TODO ((self.paginationModel.page()-1)*self.paginationModel.pageSize()) +
                  "&count="+ count(), //TODO self.paginationModel.pageSize()
                  function(data) { //TODO ADD FILTER

                      console.log( "result retrieved: " + data.nodes.length );
                      ko.utils.arrayPushAll(self.items, data.nodes);
                      self.items.valueHasMutated();
                    console.log( "items loaded");
                  }
            );
            self.loading = false;
        }
    }

    // EXPANDABLE
    self.viewModel = new AlbumViewModel();
    //calculate the position of the element passed.
    var cumulativeOffset = function(element) {
        var top = 0;
        var left = 0;

        var viewportOffset = element[0].getBoundingClientRect();
        top = viewportOffset.top;
        left = viewportOffset.left;

        return {
            top: top,
            left: left
        };
    };

    //exand the node content in the list view.
    self.expand_last = -1;

    self.calculate_expand_last_in_row = function(node) {
        var _col = $("#"+node);
        do {
            _offset = cumulativeOffset( _col );
            if( $( window ).width() <  _offset.left+(2*self.itemSize()) ) {
                return _col.attr( "id" );
            } else {
                _col = _col.nextAll('.galleryItem').first();
            }
        } while( _col != null && !(_col === 'undefined') );
        return node.nextAll('.galleryItem').last().attr( "id" );
    }

    self.calculate_expand_index = function(node) {
        var col_id = self.calculate_expand_last_in_row( node );
        var reuse = false;
        var direction = "buttom";

        if( self.expand_last != -1 ) {
            if( col_id == self.expand_last ) {
                reuse = true;
            } else {
                __next_last_col = self.calculate_expand_last_in_row( $("#"+self.expand_last).nextAll('.galleryItem').next().attr( "id" ) );
                __list = $("#"+self.expand_last).nextAll('.galleryItem').each(function(index, value){
                    if( value.id == node ) {
                        reuse = true;
                        direction = "top";
                        col_id = self.expand_last;
                        return false;
                    }
                    if( __next_last_col == value.id ) {
                        return false;
                    }
                });
            }
        }

        return {
          col_id: col_id,
          reuse: reuse,
          direction: direction
        };
    }

    self.expand = function(data, event, param) {

        var _index = self.calculate_expand_index( param );
        _param = $("#"+param);

        if( _index.reuse == false ) {
            $("#albumCollapse"+self.expand_last).collapse({
              toggle: false
            })
            $("#albumCollapse"+self.expand_last).remove();
            $("#"+_index.col_id).after('<div class="container-fluid" id="albumCollapse' + _index.col_id + '">PLACEHOLDER</div>');
        }

        self.expand_last = _index.col_id;
        $(".arrow-up").hide();
        //TODO does not exist. $(".arrow-down").hide();
        $("#arrow"+_param.attr("id")).show(); //TODO create up and down arrows
        self.viewModel.render( data, $("#albumCollapse"+_index.col_id)[0] );
        console.log( "node: " + data.key +", " + data.name + ", " + data.thumb );
    }

    //INIT PAGE
    windowSize();
    populateItems( self.numItemsPerPage );
}

//ko.applyBindings(new GalleryModel());
