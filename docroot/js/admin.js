function cdsModel() {
    var self = this;
    self.httpIp = ko.observable('0');
    self.httpPort = ko.observable('0');
    self.media = ko.observableArray();

    $.ajax({
    url: "http://192.168.0.1:9001/cds/config",
    method: "GET",
    headers: {"Accept": "application/json; odata=verbose"},
      success: function(data) {
          self.httpIp( data.httpIp );
          self.httpPort( data.httpPort );
          ko.utils.arrayPushAll(self.media, data.media);
      },
      error: function (fn, status, error) {
        console.log('Error:' + error);
      }
    });
}

var AdminModel = {
    cds: cdsModel
}

function initializeModel() {
    // Create list view model
    var adminModel = AdminModel;
    adminModel.cds = new cdsModel();
    ko.applyBindings(adminModel);
}
initializeModel();
