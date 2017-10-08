function AdminModel( params ) {
    var self = this;
    self.httpIp = ko.observable('0');
    self.httpPort = ko.observable('0');
    self.media = ko.observableArray();

    $.getJSON( "config", function( data ) {
        self.httpIp( data.httpIp );
        self.httpPort( data.httpPort );
        ko.utils.arrayPushAll(self.media, data.media);
    });
}

ko.components.register('admin-page-widget', {
    viewModel: AdminModel,
    template: '<div class="row" style="min-height:300px;">\
    <!-- div  class="col-sm-6"-->\
        <h3>Left Tabs</h3>\
        <hr/>\
        <div class="col-xs-3">\
            <!-- required for floating -->\
            <!-- Nav tabs -->\
            <ul class="nav nav-tabs tabs-left">\
                <li class="active"><a href="#home" data-toggle="tab">Home</a></li>\
                <li><a href="#cds" data-toggle="tab">Content Directory</a></li>\
                <li><a href="#messages" data-toggle="tab">Messages</a></li>\
                <li><a href="#settings" data-toggle="tab">Settings</a></li>\
            </ul>\
        </div>\
        <div class="col-xs-9">\
            <!-- Tab panes -->\
            <div class="tab-content" id="admin">\
                <div class="tab-pane active" id="home">Home Tab.</div>\
                <div class="tab-pane" id="cds"><h4>configure content directory:</h4>\
                    <form class="navbar-form navbar-left" role="form">\
                      <div class="form-group">\
                        <p><input type="text" class="form-control" placeholder="http ip"\
                            required pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$" data-bind="value: cds.httpIp">\
                        <br/>http ip address</p>\
                        <p><input type="text" class="form-control" placeholder="http port"\
                            required pattern="^([0-9]*$" data-bind="value: cds.httpPort">\
                        <br/>http port</p>\
                      </div>\
\
                      <div class="form-group">\
                    </form>\
                    <p class="none">Media Directories: <br/><input data-bind=""/></p>\
                    <select multiple="multiple" width="50" data-bind="options: cds.media"> </select>\
                    </div>\
                    <button type="submit" class="btn btn-default">Submit</button>\
                </div>\
                <div class="tab-pane" id="messages">Messages Tab.</div>\
                <div class="tab-pane" id="settings">Settings Tab.</div>\
            </div>\
        </div>'
});
