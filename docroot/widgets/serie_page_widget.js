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
'XX: <span data-bind="text: name"/>\
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
