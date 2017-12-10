var API_URI="http://192.168.0.1:9001/";

(function($) {
  "use strict"; // Start of use strict

  // Floating label headings for the contact form
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });

  // Show the navbar when the page is scrolled up
  var MQL = 1170;

  //primary navigation slide-in effect
  if ($(window).width() > MQL) {
    var headerHeight = $('#mainNav').height();
    $(window).on('scroll', {
        previousTop: 0
      },
      function() {
        var currentTop = $(window).scrollTop();
        //check if user is scrolling up
        if (currentTop < this.previousTop) {
          //if scrolling up...
          if (currentTop > 0 && $('#mainNav').hasClass('is-fixed')) {
            $('#mainNav').addClass('is-visible');
          } else {
            $('#mainNav').removeClass('is-visible is-fixed');
          }
        } else if (currentTop > this.previousTop) {
          //if scrolling down...
          $('#mainNav').removeClass('is-visible');
          if (currentTop > headerHeight && !$('#mainNav').hasClass('is-fixed')) $('#mainNav').addClass('is-fixed');
        }
        this.previousTop = currentTop;
      });
  }
})(jQuery); // End of use strict


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

function SerieViewModel() {
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

        $.getJSON( API_URI+self.key()+"/nodes", function( data ) {
            self.audiofiles([]);
            ko.utils.arrayPushAll(self.audiofiles, data.nodes );
        });

        ko.renderTemplate("serie-template", self, {}, element, "replaceChildren");
        setTimeout( function() {
            $('#gallery').lightGallery();
        }, 2000 );
    }
}

// ------------------------------------------------------------------------------------------------
// --- Application View Model                                                                   ---
// ------------------------------------------------------------------------------------------------
function SquawkViewModel() {
    var self = this;

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
            if( $( window ).width() <  _offset.left+160+160 ) { //TODO calcultate or configure size
                //TODO remove dot.
                $("#dot").css({borderColor: "Red", top: _offset.top, left: _offset.left+160, position:'absolute'});
                return _col.attr( "id" );
            } else {
                _col = _col.nextAll('.squawkItem').first();
            }
        } while( _col != null && !(_col === 'undefined') );
        return node.nextAll('.squawkItem').last().attr( "id" );
    }

    self.calculate_expand_index = function(node) {
        var col_id = self.calculate_expand_last_in_row( node );
        var reuse = false;
        var direction = "buttom";

        if( self.expand_last != -1 ) {
            if( col_id == self.expand_last ) {
                reuse = true;
            } else {
                __next_last_col = self.calculate_expand_last_in_row( $("#"+self.expand_last).nextAll('.squawkItem').next().attr( "id" ) );
                __list = $("#"+self.expand_last).nextAll('.squawkItem').each(function(index, value){
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

    //event handlers

    //selected content
    self.nodes = ko.observableArray();
    ko.extenders.viewChange = function(target, option) {
        target.subscribe(function(newValue) {
            console.log( "load nodes and sort key for: " + self.key() + ", type: " + self.key() + ", target:"+ target() + ", option:" + option );
            if( option == "key" ) {

                if( self.key() == 'album' ) {
                    self.viewModel = new AlbumViewModel();
                } else if( self.key() == 'serie' ) {
                    self.viewModel = new SerieViewModel();
                } else {
                    console.log( "wrong type: " + self.key() + ", type: " + self.key() + ", target:"+ target() + ", option:" + option );
                }
                //get sort criteria
                $.getJSON( API_URI+newValue+"/sort", function( data ) {
                    self.sortKeys([]);
                    ko.utils.arrayPushAll(self.sortKeys, data);
                });
            }
            //get nodes
            $.get(API_URI+self.key()+"/nodes" +
                  "?index=" + "0" + //TODO ((self.paginationModel.page()-1)*self.paginationModel.pageSize()) +
                  "&count="+ "128" + //TODO self.paginationModel.pageSize()+
                  "&sort="+self.sort()+
                  "&order="+(self.order()?"asc":"desc")+
                  "&filter="+self.search(),
                  function(data) { //TODO ADD FILTER
                    self.nodes([]);
                    ko.utils.arrayPushAll(self.nodes, data.nodes);
                  }
            );
        });
        return target;
    };

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

    //the node list navigation
    self.node = ko.observable(); //todo remove
    self.page = ko.observable("album-page-widget"); //TODO remove

    //root_nodes
    self.navigation_nodes = ko.observableArray();

    //filter and order
    self.key = ko.observable().extend( {viewChange: "key"} );
    self.search = ko.observable( "" ).extend( {viewChange: "search"} );
    self.order = ko.observable( false ).extend( {viewChange: "order"} );
    self.orderStyle = ko.observable( "fa-sort-amount-asc" );
    self.sort = ko.observable( "alpha" ).extend( {viewChange: "sort"} );
    self.sortKeys = ko.observableArray();

    self.viewModel = new AlbumViewModel();

    //select item icon
    self.style = function (data, size ) {
        return ko.computed({
            read: function () {
                if (size === undefined) {
                    size = "";
                }
                if( data.key == "album" ) {
                    return "fa fa-music "+size;
                } else if( data.key == "artist" ) {
                    return "fa fa-users "+size;
                } else if( data.key == "ebook" ) {
                    return "fa fa-book "+size;
                } else if( data.key == "image" ) {
                    return "fa fa-photo "+size;
                } else if( data.key == "movie" ) {
                    return "fa fa-film "+size;
                } else if( data.key == "serie" ) {
                    return "fa fa-television "+size;
                } else if( data.key == "folder" ) {
                    return "fa fa-folder "+size;
                } else if( data.key == "album" ) {
                    return "fa fa-music "+size;
                } else if( data.key == "audio" ) {
                    return "fa fa-file-audio-o "+size;
                } else return "fa fa-folder "+size;
            },
            write: function (cls) {}
        }, this);
    };

    //load initial data
    $.get(API_URI+"/root/nodes", function(data) {
        ko.utils.arrayPushAll(self.navigation_nodes, data.nodes);
        //ko.utils.arrayPushAll(self.nodes, data.nodes);
    });
}

ko.applyBindings(new SquawkViewModel());
