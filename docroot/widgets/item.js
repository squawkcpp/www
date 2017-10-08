function NodeViewModel( params ) {
    var self = this;
    self.data = params.object;
    self.url = ko.computed( function () {
        if (typeof self.data === 'undefined' || self.data === null) {
            return "";
        }
        return API_URI + "/res/" + self.data.key + self.data.ext;
    });
}

ko.components.register('folder', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <span class="browse"\ data-bind="click: function() { $root.push( data.key, data.name ) }, css: $root.style(data)"/>\
         <p data-bind="text:data.name"></p>\
        </div>'
});
ko.components.register('album', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="media">\
        <img class="d-flex mr-3" data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.thumb }"/>\
        <div class="media-body"><h5 class="mt-0" data-bind="text:data.name"></h5>\
        Artist: <span data-bind="text:data.artist" />, Year: <span data-bind="text:data.year" /><br/>\
        </div></div>'
});
ko.components.register('audio', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.thumb, title: data.album }"/>\
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
<img class="d-flex mr-3" data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.thumb, title: data.name }" alt="cover">\
<div class="media-body">\
  <h5 class="mt-0" data-bind="text:data.name"></h5>\
  <span data-bind="html:data.comment"></span>\
</div>\
</div>'
});
ko.components.register('image', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.tn, title: data.name+data.ext }"/>\
         <p class="card-text">\
            <span data-bind="text:data.name" />\
         </p>\
        </div>'
});
ko.components.register('cover', {
    viewModel: function(params) {
        return new NodeViewModel( params );
    },
    template:
        '<div class="card">\
        <img data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.tn, title: data.name+data.ext }"/>\
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
            <a href="#" data-bind="click: function() { $root.push(data.key, data.name) }, text:data.name" />\
            </p>\
        </div>'
});
ko.components.register('serie', {
    viewModel: function(params) { return new NodeViewModel( params ); },
    template:
'<div class="media">\
<img class="d-flex mr-3" data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.thumb, title: data.name }" alt="cover">\
<div class="media-body">\
  <h5 class="mt-0" data-bind="text:data.name"></h5>\
  <span data-bind="html:data.comment"></span>\
</div>\
</div>'
});
ko.components.register('ebook', {
    viewModel: function(params) { return new NodeViewModel( params ); },
    template:
'<div class="media">\
 <img class="d-flex mr-3" data-bind="click: function() { $root.push(data.key, data.name) }, attr: { src: API_URI+data.thumb, title: data.name }" alt="cover">\
 <div class="media-body">\
   <h5 class="mt-0" data-bind="text:data.name"></h5>\
   <span data-bind="html:data.comment"></span>\
 </div>\
</div>'
});
