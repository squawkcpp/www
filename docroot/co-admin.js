ko.components.register('admin-widget', {
    viewModel: function(params) {
        var self = this;

        self.httpIp = ko.observable('0');
        self.name = ko.observable();
        self.httpPort = ko.observable('0');
        self.media = ko.observableArray();

        console.log( "get config: "+API_URI+"config" );
        $.getJSON( API_URI+"config", function( data ) {
            console.log( "success: "+API_URI+"config" );
            self.name( data.name );
            self.httpPort( data.http_port );
            self.httpIp( data.listen_address );
        });

    },
    template:  { element: "admin-template" }
});
