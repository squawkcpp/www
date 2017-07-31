ko.components.register('serie-page-widget', {
    viewModel: function(params) {
        var self = this;
        self.key = ko.observable();
        self.name = ko.observable();
        self.cls = ko.observable();
        self.serie = ko.observable();
        self.year = ko.observable();

        self.episodes = ko.observableArray();

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
                    self.serie( data.serie );
                    self.year( data.year );
                });
                $.getJSON( "/cds/"+params.key() + "/nodes", function( data ) {
                    self.episodes([]);
                    for (var k = 0; k < data.nodes.length; k++) {
                            self.episodes.push(data.nodes[k]);
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
  <div class="panel-body">\
      <!-- Table -->\
      <table class="table">\
        <thead>\
            <tr><th>#</th><th>Title</th><th>Artist</th><th>Album</th><th>Year</th><th>length</th><th>Bitrate</th><th>Samplerate</th><th>Bps.</th><th>Channels</th></tr>\
        <thead>\
        <tbody data-bind="foreach: {data: episodes}">\
        <tr>\
            <td data-bind="text: name"/>\
            <td data-bind="text: season"/>\
            <td data-bind="text: episode"/>\
            <!-- td data-bind="text: playlength"/>\
            <td data-bind="text: year"/>\
            <td data-bind="text: playlength"/>\
            <td data-bind="text: width"/>\
            <td data-bind="text: height"/>\
            <td data-bind="text: bps"/>\
            <td data-bind="text: channels"/ -->\
         </tr>\
         <tbody>\
      </table>\
    </div>\
</div>'
});
