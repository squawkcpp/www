function NodeViewModel( params ) {
    var self = this;
    self.data = params.object;

    self.title = ko.computed( function () {
        return self.data.album + " - " + self.data.artist + " (" + self.data.year + ")";
    });
    self.url = ko.computed( function () {
        return "/res/" + self.data.key + self.data.ext;
    });
}

ko.components.register('folder', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <span id="browse"\ data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, css: $root.style(data)"/>\
         <p class="card-text" data-bind="text:data.name"></p>\
        </div>'
});
ko.components.register('album', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, attr: { src: data.thumb, title: data.album }"/>\
         <p class="card-text">\
            <span data-bind="text:data.album" />\
            /<span data-bind="text:data.artist" />\
            (<span data-bind="text:data.year" />)\
         </p>\
        </div>'
});
ko.components.register('audio', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, attr: { src: data.thumb, title: data.album }"/>\
         <p class="card-text">\
            <span data-bind="text:data.album" />\
            /<span data-bind="text:data.artist" />\
            (<span data-bind="text:data.year" />)\
         </p>\
        </div>'
});
ko.components.register('file', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="media">\
         <div class="media-left" data-bind="css: $root.style(data)">\
             <a data-bind="attr: { href: url, title: data.name }">\
                 <p class="card-text">\
                    <span data-bind="text:data.name" />\
                    <span data-bind="text:data.ext" />\
                 </p>\
            </a>\
         </div>\
        </div>'
});
ko.components.register('movie', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="media">\
         <div class="media-left" data-bind="css: $root.style(data)">\
             <a data-bind="attr: { href: url, title: name }, text:data.name"></a>\
         </div>\
         <div class="media-body">\
         </div>\
        </div>'
});
ko.components.register('image', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img width="200px" height="200px" data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, attr: { src: url, title: data.album }"/>\
         <p class="card-text">\
            <span data-bind="text:data.name" />\
         </p>\
        </div>'
});
ko.components.register('artist', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
            <p class="card-text">\
            <img src=""/>\
            <a href="#" data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, text:data.artist" />\
            </p>\
        </div>'
});
ko.components.register('serie', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, attr: { src: data.thumb, title: data.serie }"/>\
        <p class="card-text">\
           <span data-bind="text:data.name" />\
           (<span data-bind="text:data.year" />)\
        </p>\
        </div>'
});
ko.components.register('ebook', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.load(data.cls, data.key, data.name) }, attr: { src: data.thumb, title: data.serie }"/>\
        <p class="card-text">\
           <span data-bind="text:data.name" />\
           (<span data-bind="text:data.year" />)\
        </p>\
        </div>'
});
