function EBookViewModel() {
    var self = this;
    self.key = ko.observable();
    self.name = ko.observable();
    self.author= ko.observable();
    self.comment = ko.observable();
    self.date = ko.observable();
    self.ext = ko.observable();
    self.isbn = ko.observable();
    self.mimeType = ko.observable();
    self.publisher = ko.observable();
    self.thumb = ko.observable();

    self.render = function( data, element ) {
        self.key(data.key);
        self.name(data.name);
        self.author(data.author);
        self.comment(data.comment);
        self.date(data.date);
        self.ext(data.ext);
        self.isbn(data.isbn);
        self.mimeType(data.mimeType);
        self.publisher(data.publisher);
        self.thumb(data.thumb);
        ko.renderTemplate("ebook-template", self, {}, element, "replaceChildren");
    }
}
