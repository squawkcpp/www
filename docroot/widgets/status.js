function StatusModel( params ) {
    var self = this;
    self.nodes = ko.observable('0');
    self.albums = ko.observable('0');

    $.getJSON( "/cds/status", function( data ) {
        self.nodes( data.nodes );
        self.albums( data.albums );
    });
}

ko.components.register('status-widget', {
    viewModel: StatusModel,
    template: '<div class="container">\
      <p class="float-right">\
        <a href="#">Back to top</a>\
      </p>\
      <p id="status">Squawk Media Server: Nodes: <span data-bind="text: nodes"></span>, Albums: <span data-bind="text: albums"></span></p>\
    </div>'
});
