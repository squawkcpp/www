// infinte gallery
//
// Usage:
// props.items = ko.observableArray();
// props.items.extend({
//    gallery: { itemSize: 164 }
//});


ko.extenders.gallery = function(target, args) {
    var props = {};
    target.gallery = props;

    props.loading = false;
    props.itemSize = ko.observable(160);
    props.numItemsPerPage = ko.observable();
    props.numItemsPerLine = ko.observable();
    props.itemsLoaded = ko.observable(0);
    props.windowWidth = ko.observable();
    props.windowHeight = ko.observable();
    props.scrollY = ko.observable();
    props.viewModel = ko.observable( args.viewModel );

    props.reset = function() {
        props.loading = false;
//        props.viewModel( vm );
        props.itemsLoaded( 0 );
        props.expand_last = -1;
        //INIT PAGE
        props.windowSize();
        props.populateItems( props.numItemsPerPage );
    };

    props.windowSize = ko.computed(function() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0];
        props.windowWidth( w.innerWidth || e.clientWidth || g.clientWidth );
        props.windowHeight( w.innderHeight|| e.clientHeight|| g.clientHeight );

        props.numItemsPerLine( Math.floor( props.windowWidth() / args.itemSize ) );
        props.numItemsPerPage( ( Math.ceil( props.windowHeight() / args.itemSize ) ) * props.numItemsPerLine() );
    });

    // detect resize
    $(window).resize(function() {
        props.windowSize();
    });

    // tell infinte-scroll about the current scroll position
    // (debounce is important for ie11 smooth scroll problems! and also generally nicer in all browsers)
    $(window).scroll(function() {
        props.scrollY($(window).scrollTop());
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        if( scrollBottom < 100 ) {
            props.populateItems( props.numItemsPerPage );
        }
    });

    // init items
    props.populateItems = function( count ) {
        if( !props.loading ) {
            props.loading = true;
            var oldItemsLoaded = props.itemsLoaded();
            props.itemsLoaded( props.itemsLoaded() + count() );
            args.loadItems( oldItemsLoaded, count(), function() {
                props.loading = false;
            });
        }
    };

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
    props.expand_last = -1;
    props.calculate_expand_last_in_row = function(node) {
        var _col = $("#"+node);
        do {
            _offset = cumulativeOffset( _col );
            if( $( window ).width() <  _offset.left+(2*props.itemSize() ) ) {
                return _col.attr( "id" );
            } else {
                _col = _col.nextAll('.galleryItem').first();
            }
        } while( _col != null && !(_col === 'undefined') );
        return node.nextAll('.galleryItem').last().attr( "id" );
    }

    props.calculate_expand_index = function(node) {
        var col_id = props.calculate_expand_last_in_row( node );
        var reuse = false;
        var direction = "buttom";

        if( props.expand_last != -1 ) {
            if( col_id == props.expand_last ) {
                reuse = true;
            } else {
                __next_last_col = props.calculate_expand_last_in_row( $("#"+props.expand_last).nextAll('.galleryItem').next().attr( "id" ) );
                __list = $("#"+props.expand_last).nextAll('.galleryItem').each(function(index, value){
                    if( value.id == node ) {
                        reuse = true;
                        direction = "top";
                        col_id = props.expand_last;
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

    props.expand = function(data, event, param) {
        var _index = props.calculate_expand_index( param );
        _param = $("#"+param);

        if( _index.reuse == false ) {
            $("#galleryCollapse"+props.expand_last).collapse({
              toggle: false
            })
            $("#galleryCollapse"+props.expand_last).remove();
            $("#"+_index.col_id).after('<div class="container-gallery" id="galleryCollapse' + _index.col_id + '">PLACEHOLDER</div>');
            $("#galleryCollapse"+_index.col_id).height( props.windowHeight() - ( props.windowHeight() / 3 ) );
        }

        props.expand_last = _index.col_id;
        $(".arrow-up").hide();
        $(".arrow-down").hide();
        $("#arrow"+_param.attr("id")).show(); //TODO create up and down arrows
        props.viewModel().render( data, $("#galleryCollapse"+_index.col_id)[0] );
        $(".cds_content").height( props.windowHeight() - ( props.windowHeight() / 3 ) - 100 );
    }

    //INIT PAGE
    props.windowSize();
    props.populateItems( props.numItemsPerPage );

}
