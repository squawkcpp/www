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
