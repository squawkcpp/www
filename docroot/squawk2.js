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



ko.components.register('album-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.methods = $('#gallery');
        self.node = params.node;
        self.nodes = ko.observable();
        self.audiofiles = ko.computed(function() {
            return ko.utils.arrayFilter(self.nodes(), function(item) {
                return item.cls == "audio";
            });
        });
        self.covers = ko.computed(function() {
            return ko.utils.arrayFilter(self.nodes(), function(item) {
                return item.cls == "cover";
            });
        });
        self.cover_url = ko.computed(function(key) {
            if( typeof key !== 'undefined' ) {
                return API_URI + "/res/" + key + ".jpg";
            } return "";
        });
        for( i=0; i<self.covers().length; i++ ) {

            self.methods.append("<li class=\"col-xs-6 col-sm-4 col-md-3\" data-src=\"" + API_URI + "/res/" + self.covers()[i].key + self.covers()[i].ext + "\">"+
                                "<a href=\"\"><img class=\"img-responsive\" src=\"" + API_URI + "/img/tn_" + self.covers()[i].key + ".jpg\">"+
                                "<div class=\"demo-gallery-poster\"><img src=\"http://sachinchoolur.github.io/lightGallery/static/img/zoom.png\"></div></a></li>");
        }

        self.methods.lightGallery();
    },
    template:
'                           Album Component: \
<div class="panel panel-default">\
<div class="demo-gallery dark mrb15">\
  <ul id="gallery" class="list-unstyled row"></ul>\
</div>\
  <div class="panel-heading"><h4 data-bind="text: node.name"/><span data-bind="text: node.artist"/><br/><span data-bind="text: node.year"/></div>\
<div class="panel-body">\
  <table class="table">\
    <thead>\
        <tr><th>#</th><th>Title</th><th>Artist</th><th>Album</th><th>Year</th><th>length</th><th>Bitrate</th><th>Samplerate</th><th>Bps.</th><th>Channels</th></tr>\
    <thead>\
    <tbody data-bind="foreach: {data: audiofiles}">\
    <tr>\
        <td data-bind="text: track"/>\
        <td data-bind="text: name"/>\
        <td data-bind="text: artist"/>\
        <td data-bind="text: album"/>\
        <td data-bind="text: year"/>\
        <td data-bind="text: playlength"/>\
        <td data-bind="text: bitrate"/>\
        <td data-bind="text: samplerate"/>\
        <td data-bind="text: bps"/>\
        <td data-bind="text: channels"/>\
     </tr>\
     </tbody>\
  </table>\
</div>'
});

function AlbumViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.artist = ko.observable();
    self.year = ko.observable();
    self.audiofiles = ko.observableArray();
    self.covers = ko.observableArray();

    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
        self.artist(data.artist);
        self.year(data.year);

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

// Overall viewmodel for this screen, along with initial state
function SquawkViewModel() {
    var self = this;
    self.viewModel = new AlbumViewModel();

    var cumulativeOffset = function(element) {
        var top = 0;
        var left = 0;
        do {
            if( !(element.position() === 'undefined') ) {
                top += element.position().top  || 0;
                top -= parseInt( element.css('padding-top') ) || 0;
                top -= parseInt( element.css('margin-top') ) || 0;
                top -= parseInt( element.css('border-top-width') ) || 0;
                top -= parseInt( element.css('spacing-top') ) || 0;

                left += element.position().left || 0;
                left -= parseInt( element.css('padding-left') ) || 0;
                left -= parseInt( element.css('margin-left') ) || 0;
                left -= parseInt( element.css('border-left-width') ) || 0;
                left -= parseInt( element.css('spacing-left') ) || 0;
            }
            element = element.parent();
        } while( element.prop("tagName")!="HTML" );

        return {
            top: top,
            left: left
        };
    };

    self.expand_last = -1;
    self.expand = function(data, event, param) {
        _index = param;
        _param = $("#col"+param);
        _offset = cumulativeOffset( _param );
        found = false;
        var _param_iterate = _param;
        do {
            _offset = cumulativeOffset( _param_iterate );
            if( $( window ).width() <  _offset.left+160+160 ) {
                found = true;
                $("#dot").css({borderColor: "Red", top: _offset.top, left: _offset.left+160, position:'absolute'});
            } else {
                _index++;
                _param_iterate = _param_iterate.nextAll('.col').first();
            }
        } while( found == false && _param_iterate != null && !(_param_iterate === 'undefined') );

        console.log( "index: " + _index );
        if( self.expand_last == _index ) {
            console.log( "reuse last expand: " + self.expand_last );
        } else {
            console.log( "create expand: " + _index );
            $("#albumCollapse"+self.expand_last).collapse({
              toggle: false
            })
            $("#albumCollapse"+self.expand_last).remove();
            $("#col"+_index).after('<div class="container-fluid" id="albumCollapse' + _index + '">PLACEHOLDER</div>');
        }

        self.expand_last = _index;
        self.viewModel.render( data, $("#albumCollapse"+_index)[0] );
    }

    //root_nodes
    self.navigation_nodes = ko.observableArray();

    //autocomplete input
    self.search = ko.observable();
    self.getOptions = function(searchTerm, callback) {
            $.ajax({
              dataType: "json",
              url: API_URI+"/sug/"+searchTerm,
            }).done(callback);
        };

    //selected content
    self.nodes = ko.observableArray();
    ko.extenders.viewChange = function(target, option) {
        target.subscribe(function(newValue) {
            $.get(API_URI+newValue+"/nodes", function(data) {
                self.nodes([]);
                ko.utils.arrayPushAll(self.nodes, data.nodes);
            });
        });
        return target;
    };
    self.key = ko.observable().extend( {viewChange: "key"} );

//    self.expand = function ( node ) {
//        console.log( "this is: " + this );
//        var bmdiv = document.createElement('div');
//        bmdiv.innerHTML = 'xxxxx<div data-bind="component: { name: $root.page, params: { node: $root.node }}"></div>';
//        $('#'+node.key ).append( bmdiv );

//        self.node( node );
//        self.page( "album-page-widget" );
//    }

    self.node = ko.observable();
    self.page = ko.observable("album-page-widget");

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
        ko.utils.arrayPushAll(self.nodes, data.nodes);
    });
}

ko.applyBindings(new SquawkViewModel());
