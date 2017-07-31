ko.components.register('folder-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.computed(function(){
            $.getJSON( "/cds/"+params.key()+"/nodes", function( data ) {
                  self.folders([]);
                  for (var k = 0; k < data.nodes.length; k++) {
                      self.folders.push(data.nodes[k]);
                  }
            });
            return params.key();
        });
        self.folders = ko.observableArray();
        self.files = ko.observableArray();
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
          <div class="container" id="content" data-bind="foreach:files">\
              <div data-bind="component: { \
                  name: cls, \
                  params: { object: $data }}"> \
              </div> \
          </div>\
        </div>\
    </div>'
});
