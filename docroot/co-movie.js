function MovieViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.comment = ko.observable();
    self.thumb = ko.observable();
    self.med = ko.observable();
    self.backdrop = ko.observable();
    self.poster = ko.observable();
    self.tmdb = ko.observableArray();
    self.mimeType = ko.observable();
    self.ext = ko.observable();

    self.uri = function() {
        return "/res/" + self.key() + self.ext();
    }

    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
        self.comment(data.comment);
        self.thumb(data.thumb);
        self.med(data.med);
        self.backdrop(data.backdrop_path);
        self.poster(data.poster_path);
        self.tmdb(data.tmdb_id);
        self.mimeType(data.mimeType);
        self.ext(data.ext);

        ko.renderTemplate("movie-template", self, {}, element, "replaceChildren");
        setTimeout( function() {
            $('#html5-videos').lightGallery();
        }, 2000 );
    }
}
