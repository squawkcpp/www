function SerieViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.comment = ko.observable();
    self.thumb = ko.observable();
    self.med = ko.observable();
    self.backdrop = ko.observable();
    self.poster = ko.observable();
    self.tmdb = ko.observableArray();

    self.episodes = ko.observableArray();

    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
        self.comment(data.comment);
        self.thumb(data.thumb);
        self.med(data.med);
        self.backdrop(data.backdrop_path);
        self.poster(data.poster_path);
        self.tmdb(data.tmdb_id);

        $.getJSON( API_URI+self.key()+"/nodes", function( data ) {
            self.episodes([]);
            ko.utils.arrayPushAll(self.episodes, data.nodes );
        });
        ko.renderTemplate("serie-template", self, {}, element, "replaceChildren");
        setTimeout( function() {
            $('#gallery').lightGallery();
        }, 2000 );
    }
}
