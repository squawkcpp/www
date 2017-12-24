ko.components.register('admin-widget', {
    viewModel: function(params) {
        var self = this;

        self.httpIp = ko.observable('0');
        self.name = ko.observable();
        self.httpPort = ko.observable('0');
        self.media = ko.observableArray();

        $.getJSON( API_URI+"config", function( data ) {
            self.name( data.name );
            self.httpPort( data.http_port );
            self.httpIp( data.listen_address );
        });

    },
    template:  { element: "admin-template" }
});
