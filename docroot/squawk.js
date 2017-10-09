var API_URI="http://192.168.0.1:9001/";

function NodeViewModel( params ) {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.cls = ko.observable();
    self.artist = ko.observable();
    self.year = ko.observable();
    self.genre = ko.observable();
    self.ext = ko.observable();
    self.backdrop_path = ko.observable();
    self.poster_path = ko.observable();

    self.url = ko.computed( function () {
        if( typeof self.key !== 'undefined' ) {
            return API_URI + "/res/" + self.key() + self.ext();
        } return "";
    });
}

function PathModel() {
    var self = this;
    self.path = ko.observableArray();
    self.reset = function() {
        self.path([]);
    }
    self.push = function( item ) {
        if( self.path().length > 0 ) {
            for( i=0; i<self.path().length; i++ ) {
                if( self.path()[i].key == item.key ) {
                    self.path.splice( i, self.path().length );
                    break;
                }
            }
        }
        self.path.push( item );
    }
}

function PaginationViewModel(root) {
    var self = this;
    self.root = root;
    ko.extenders.pageChange = function(target, option) {
        target.subscribe(function(newValue) {
            self.root.load_nodes( self.root.key() );
        });
        return target;
    };
    self.page =  ko.observable(0).extend({pageChange: "page"});
    ko.extenders.totalChange = function(target, root) {
        target.subscribe(function(newValue) {
            console.log( "update pager total. " + newValue );
            if( newValue > self.pageSize() ) {
                $( "#pager" ).show();
            } else { // hide pager
                $( "#pager" ).hide();
            }
        });
        return target;
    };
    self.total = ko.observable(0).extend({totalChange: "total" });
    self.maxPages = ko.observable(10);
    self.directions = ko.observable(true);
    self.boundary = ko.observable(true);
    self.pageSize = ko.observable(16);
    self.text = {
        first: ko.observable('First'),
        last: ko.observable('Last'),
        back: ko.observable('«'),
        forward: ko.observable('»')
    };
}

//TODO not used
ko.components.register('navigation-widget', {
    viewModel: function(params) {
        this.sortKeys  = params.sortKeys;
        self.path = params.path;
    },
    template:
'<nav class="navbar navbar-expand-lg navbar-light bg-light">\
    <path-widget params="value: path"></path-widget>\
    <div class="input-group">\
        <span class="input-group-addon" id="btnGroupAddon2">@</span>\
        <input type="text" class="form-control" placeholder="Input group example" aria-label="Input group example" aria-describedby="btnGroupAddon2">\
    </div>\
    <div class="btn-group" role="group">\
        <button type="button" class="btn btn-primary">Primary</button>\
    </div>\
    <!-- form class="search-box form-inline my-2 my-lg-0">\
      <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">\
        <div class="btn-group form-group" data-toggle="buttons" data-bind="radio: sort">\
          <label class="btn btn-default">\
              <input type="radio" name="modalSizing" value="timestamp" />\
              time\
          </label>\
          <label class="btn btn-default">\
              <input type="radio" name="modalSizing" value="alpha" />\
              alpha\
          </label>\
      </div>\
      <button class="btn btn-first" data-bind="toggle: order"><i class="fa fa-sort-alpha-asc" aria-hidden="true"></i></button>\
    </form -->\
</nav>'
});

ko.components.register('status-widget', {
    viewModel: function(params) {
        var self = this;
        self.nodes = params.nodes;
        self.albums = params.albums;
        self.version = params.version;
    },
template: '<div class="container">\
 <p class="float-right">\
   <a href="#">Back to top</a>\
 </p>\
 <p id="status">Squawk Media Server (<span data-bind="text: version"/>), Nodes: <span data-bind="text: nodes"></span>, Albums: <span data-bind="text: albums"></span></p>\
</div>'
});

ko.components.register('root-widget', {
    viewModel: function(params) {
        var self = this;
        self.nodes = params.nodes;
    },
    template:
'<div class="menu text-muted" data-bind="foreach:nodes">\
       <span class="menu-item" id="browse"\ data-bind="click: function() { $root.reset( key ) }, css: $root.style($data, \'fa-2x\')"/>\
</div>'
});

ko.components.register('path-widget', {
    viewModel: function(params) {
        var self = this;
        self.pathModel = params.value;
    },
    template:
        '<ol class="nav nav-pills" \
           data-bind="foreach: {data: pathModel.path}"> \
           <!-- ko if: ($index() == 0 ) --> \
           <li class="nav-item"><a data-bind="click: function() { $root.push( key, name ) }, attr: { href: "#", title: name }"><img src="/icons/squawk32.png"/></a></li>\
           <!-- /ko --> \
           <!-- ko if: ($index() > 0 && $index() == ($parent.pathModel.length - 1)) --> \
           &gt;&nbsp;<li class="nav-item disabled" data-bind="text: name"></li> \
           <!-- /ko --> \
           <!-- ko if: ($index() > 0 && $index() != ($parent.pathModel.length - 1)) -->\
           &gt;&nbsp;<li class="nav-item active"><a data-bind="click: function() { $root.push( key, name ) }, attr: { href: "#", title: name }"><span data-bind="text: name"/></a></li> \
           <!-- /ko --> \
        </ol>'
});

ko.components.register('search-widget', {
    viewModel: function(params) {
        this.search = params.search;
    },
    template: '<input id="search" type="text" class="form-control" data-bind="textInput: search"/>'
});

ko.components.register('order-widget', {
    viewModel: function(params) {
        this.order = params.order;
    },
template: '<button id="order" type="button" class="btn btn-secondary" data-bind="click: function() { $root.do_order() }, text: order"></button>'
});


ko.components.register('movie-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.videosHolder = $('#movie-page-video-holders');
        self.videos = $('#html5-videos');
        self.node = params.node;
        self.thumb = ko.computed(function() {
            return API_URI + "/img/med_" + self.node.key() + ".jpg";
        });
        self.uri = ko.computed(function() {
            return API_URI + "/res/" + self.node.key() + self.node.ext();
        });
        self.poster_path = ko.computed(function() {
            return API_URI + self.node.poster_path();
        });
        self.backdrop_path = ko.computed(function() {
            return API_URI + self.node.backdrop_path();
        });

        self.videosHolder.append("<div style=\"display:none;\" id=\"" + self.node.key + "\">"+
                          "<video class=\"lg-video-object lg-html5\" controls preload=\"none\">"+
                          "    <source src=\"" + self.uri() + "\">"+
                          "     Your browser does not support HTML5 video."+
                          "</video>"+
                          "</div>");
        self.videos.append("<li data-poster=\"" + self.backdrop_path() + "\" data-sub-html=\"" + self.node.name + "\" data-html=\"#"+ self.node.key + "\" ><img width=\"150px\ height=\"200px\" src=\""+ self.thumb() +"\" /></li>");
        self.videos.lightGallery();
    },
    template:
'<div style="display:none;" id="movie-page-video-holders"></div>\
<div class="panel-heading">\
<ul id="html5-videos"></ul>\
<h4 data-bind="text: node.name"/><br/><span data-bind="text: node.homepage"/><br/><span data-bind="text: node.year"/></div>\
<div class="panel-body" data-bind="text: node.comment">\
</div>'
});

ko.components.register('serie-page-widget', {
    viewModel: function( params ) {
        var self = this;

        if( params.node.cls == "serie" ) {
            self.key = params.key;
            self.key = ko.observable(params.node.key);
            self.name = ko.observable(params.node.name);
            self.cls = ko.observable(params.node.cls);
            self.serie = ko.observable(params.node.serie);
            self.year = ko.observable(params.node.year);
        } else console.log( "params is not a serie: " + params.node.cls );
        self.episodes = params.nodes;
    },
    template:
'SERIE: <span data-bind="text: name"/>\
<div class="content" data-bind="foreach: {data: episodes}">\
    <div class="media">\
      <img class="d-flex mr-3" data-bind="attr: { src: API_URI+thumb }" alt="Generic placeholder image">\
      <div class="media-body">\
        <h5 class="mt-0" data-bind="text: name"></h5>\
        Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.\
      </div>\
    </div>\
</div>'
});

ko.components.register('album-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.methods = $('#gallery');
        self.node = params.node;
        self.nodes = params.nodes;
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
'<div class="panel panel-default">\
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

ko.components.register('artist-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = params.key;
        self.artists = ko.observableArray();
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

ko.components.register('folder-page-widget', {
    viewModel: function(params) {
        node = params.node;
        folders = params.nodes;
    },
    template:
    '<span data-bind"text:key"/><div class="card">\
        <div class="album text-muted">\
          <div class="container" id="content" data-bind="foreach:folders">\
              <div data-bind="component: { \
                  name: cls, \
                  params: { object: $data }}"> \
              </div> \
          </div>\
        </div>\
    </div>'
});

function SquawkModel() {
    var self = this;
    self.path = new PathModel();
    self.page = ko.observable("folder-page-widget");
    self.node = new NodeViewModel();
    self.nodes = ko.observableArray();
    self.rootNodes = ko.observableArray();
    self.sortKeys = ko.observableArray();
    $.getJSON( API_URI+"root/nodes", function( data ) {
          for (var k = 0; k < data.nodes.length; k++) {
              self.rootNodes.push(data.nodes[k]);
          }
    });

    self.paginationModel = new PaginationViewModel( self )

    ko.extenders.viewChange = function(target, option) {
        target.subscribe(function(newValue) {
            if( option == "key" ) {
                console.log( "view change: " + option + "=" + newValue );
                self.load_node( newValue );

                self.order( false );
                self.sort( "default" );
                self.paginationModel.page( 1 );
            }
            self.load_nodes( self.key() );
        });
        return target;
    };
    self.key = ko.observable().extend( {viewChange: "key"} );
    self.search = ko.observable().extend( {viewChange: "search"} );
    self.order = ko.observable( false ).extend( {viewChange: "order"} );
    self.sort = ko.observable().extend( {viewChange: "sort"} );

    self.version = ko.observable();
    self.nodesCount = ko.observable();
    self.albumsCount = ko.observable();

    self.push = function ( key, name ) {
        console.log( "PUSH: " + key );
        self.path.push( {key: key, name: name } )
        self.key( key );
    };

    self.reset = function ( key, name ) {
        console.log( "RESET: " + key );
        self.path.reset();
        $.getJSON( API_URI+key+"/path", function( data ) {
            for( i=0; i<data.length; i++ ) {
                console.log( "push path item " + data[i].name );
                self.path.push({key: data[i].key, name: data[i].name});
            }
        });
        self.key( key );
    }

    self.load_node = function( key ) {
        console.log( "LOAD NODE: " + key );
        $.getJSON( API_URI+key, function( data ) {
            self.node.key( data.key );
            self.node.name( data.name );
            self.node.cls( data.cls );
            self.node.artist( data.artist );
            self.node.year( data.year );
            self.node.genre( data.genre );
            self.node.ext( data.ext );
            self.node.poster_path( data.poster_path );
            self.node.backdrop_path( data.backdrop_path );
            self.page( data.cls + "-page-widget" );
        });
    }

    self.do_order = function() {
        self.order( !self.order() );
        if( self.order()==true ) $("#order").addClass("active");
        else $("#order").removeClass("active");
    }
    self.do_search = function() {
        _term = $('#search').val();
        console.log( "SEARCH: " + _term );
    }

    self.load_nodes = function( key ) {
        console.log( "LOAD LIST: " + key );
        $.getJSON( API_URI+key+"/nodes?index=" + ((self.paginationModel.page()-1)*self.paginationModel.pageSize()) +
                  "&count="+self.paginationModel.pageSize()+"&sort="+self.sort()+"&order="+(self.order()?"asc":"desc")+"&filter="+self.search(), function( data ) {

            self.nodes.removeAll();
            for (var k = 0; k < data.nodes.length; k++) {
                self.nodes.push(data.nodes[k]);
            }
        });

        $.getJSON( API_URI+key+"/sort", function( data ) {
            self.sortKeys.removeAll();
            for (var k = 0; k < data.length; k++) {
                self.sortKeys.push(data[k]);
            }
        });
    }

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
    self.reset( "root", "root" );
    $.getJSON( API_URI+"status", function( data ) {
        self.version( data.version  );
        self.nodesCount( data.nodes  );
        self.albumsCount( data.content["album"] );
    });
}

function initializeModel() {
    var squawkModel = new SquawkModel();
    ko.applyBindings(squawkModel);
}
initializeModel();
