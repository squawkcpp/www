ko.components.register('album-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.observable();
        self.name = ko.observable();
        self.cls = ko.observable();
        self.album = ko.observable();
        self.artist = ko.observable();
        self.year = ko.observable();

        self.folders = ko.observableArray();
        self.covers = ko.observableArray();
        self.audio = ko.observableArray();
        self.files = ko.observableArray();

        self.url = function(node) {
            return ko.computed( function() {
                return "/res/" + node.key + node.ext;
            })
        };

        self.thumbnail = function( node ) {
            return ko.computed( function() {
                return "/cds/tn_" + node.key + ".jpg";
            })
        };

        self.key = ko.computed({
            read: function () {
                $.getJSON( "/cds/"+params.key(), function( data ) {
                    self.key( data.key );
                    self.name( data.name );
                    self.cls( data.cls );
                    self.album( data.album );
                    self.artist( data.artist );
                    self.year( data.year );
                });
                $.getJSON( "/cds/"+params.key() + "/nodes", function( data ) {
                    self.files([]);
                    self.folders([]);
                    self.audio([]);
                    self.covers([]);
                    for (var k = 0; k < data.nodes.length; k++) {
                        if( data.nodes[k].cls == "cover" ) {
                            self.covers.push(data.nodes[k]);
                        } else if( data.nodes[k].cls == "audio" ) {
                            self.audio. push(data.nodes[k]);
                        } else if( data.nodes[k].cls == "folder" ) {
                            self.folders.push(data.nodes[k]);
                        } else {
                            self.files.push(data.nodes[k]);
                        }
                    }
                } );

                return params.key();
            },
            write: function (data) {}
        });
    },
    template:
    '<div class="panel panel-default">\
  <!-- Default panel contents -->\
  <div class="panel-heading" data-bind="text: name"></div>\
    <button class="btn btn-success btn-lg mrb50" id="dynamic">Launch Gallery</button>\
    <div class="content">\
\
    <div id="lightgallery" data-bind="foreach: {data: covers}"> \
      <a data-bind="attr: { href: $parent.url($data), title: name }">\
          <img data-bind="attr: { src: $parent.thumbnail($data), title: name }" />\
      </a>\
    </div>\
  </div>\
  <div class="panel-body">\
      <!-- Table -->\
      <table class="table">\
        <thead>\
            <tr><th>#</th><th>Title</th><th>Artist</th><th>Album</th><th>Year</th><th>length</th><th>Bitrate</th><th>Samplerate</th><th>Bps.</th><th>Channels</th></tr>\
        <thead>\
        <tbody data-bind="foreach: {data: audio}">\
        <tr>\
            <td data-bind="text: track"/>\
            <td data-bind="text: name"/>\
            <td data-bind="text: artist"/>\
            <td data-bind="text: album"/>\
            <td data-bind="text: year"/>\
            <td data-bind="text: playlength"/>\
            <td data-bind="text: bitrate"/>\
            <td data-bind="text: samplerate"/>\
            <td data-bind="text: bps"/>\
            <td data-bind="text: channels"/>\
         </tr>\
         <tbody>\
      </table>\
    </div>\
    FOLDERS: <div data-bind="foreach: {data: folders}">\
        <span data-bind="text: name"></span>\
    </div>\
    FULES: <div data-bind="foreach: {data: files}">\
        <span data-bind="text: name"></span>\
    </div>\
</div>'
});
