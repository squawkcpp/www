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

    self.play = function( data, event, param ) {
        console.log( "play: " + param );
    };

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0];
    self.windowWidth = ko.observable( w.innerWidth || e.clientWidth || g.clientWidth );
    self.windowHeight = ko.observable( w.innderHeight|| e.clientHeight|| g.clientHeight );
    self.imageWidth = ko.observable( ( self.windowHeight() - self.windowHeight() / 3  - 5 ) + "px" );

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
        setTimeout( function() {
            $('#gallery').lightGallery();
        }, 2000 );
    }
}
