var getDimensions = function(element) {
  element = $(element);
  var display = $(element).getStyle('display');
  if (display != 'none' && display != null) // Safari bug
    return {width: element.offsetWidth, height: element.offsetHeight};

  // All *Width and *Height properties give 0 on elements with display none,
  // so enable the element temporarily
  var els = element.style;
  var originalVisibility = els.visibility;
  var originalPosition = els.position;
  var originalDisplay = els.display;
  els.visibility = 'hidden';
  els.position = 'absolute';
  els.display = 'block';
  var originalWidth = element.clientWidth;
  var originalHeight = element.clientHeight;
  els.display = originalDisplay;
  els.position = originalPosition;
  els.visibility = originalVisibility;
  return {width: originalWidth, height: originalHeight};
}

function AlbumViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.artist = ko.observable();
    self.year = ko.observable();
    self.genre = ko.observable();
    self.thumb = ko.observable();
    self.med = ko.observable();
    self.audiofiles = ko.observableArray();
    self.covers = ko.observableArray();
    self.dynamic_gallery = ko.observableArray();

    self.play = function( data, event, param ) {
        console.log( "play: " + param );
    };

    self.gallery = function(data, event, param) {
    console.log( "create gallery: " + data.key() +" "+ event +" "+ param );
        self.dynamic_gallery([{}]);
        for( i=0; i<self.covers().length; i++ ) {
            console.log( "push: "+API_URI+"res/"+self.covers()[i].key+self.covers()[i].ext );
            self.dynamic_gallery.push( { src: API_URI+"res/"+self.covers()[i].key+self.covers()[i].ext, thumb: self.covers()[i].tn, subHtml: self.covers()[i].name } );
        }
//      $("#albumgallery").data('lightGallery').destroy(true);
        $("#albumgallery").lightGallery({
            dynamic: true,
            dynamicEl: self.dynamic_gallery()
        });
    };

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
    self.windowWidth = ko.observable( w.innerWidth || e.clientWidth || g.clientWidth );
    self.windowHeight = ko.observable( w.innderHeight|| e.clientHeight|| g.clientHeight );
    self.imageWidth = ko.observable( ( self.windowHeight() - self.windowHeight() / 3  - 5 ) + "px" );
    self.tableHeight = ko.observable();

    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
        self.artist(data.artist);
        self.genre(data.genre);
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
        self.tableHeight( ( ( self.windowHeight() - self.windowHeight() / 3  - 5 ) - $('#albumHeader').height() ) + "px" );
    }
}
