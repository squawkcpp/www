function PathModel() {
    var self = this;
    self.path = ko.observableArray();
    self.push = function( item ) {
        if( self.path().length > 0 ) {
            for( i=0; i<self.path().length; i++ ) {
                if( self.path()[i].key == item.key ) {
                    self.path.splice( i, self.path().length );
                    break;
                }
            }
        }
        self.path.push( item );
    }
}
ko.components.register('path-widget', {
    viewModel: function(params) {
        var self = this;
        self.pathModel = params.value;
    },
    template:
        '<ol class="breadcrumb" \
           data-bind="foreach: {data: pathModel.path}"> \
           <!-- ko if: ($index() == 0 ) --> \
           <li class="breadcrumb-item"><a data-bind="click: function() { $root.load(cls, key, name) }, attr: { href: "#", title: name }"><img src="/icons/squawk32.png"/></a></li>\
           <!-- /ko --> \
           <!-- ko if: ($index() > 0 && $index() == ($parent.pathModel.path().length - 1)) --> \
           <li class="breadcrumb-item" data-bind="text: name"></li> \
           <!-- /ko --> \
           <!-- ko if: ($index() > 0 && $index() != ($parent.pathModel.path().length - 1)) -->\
           <li class="breadcrumb-item active"><a data-bind="click: function() { $root.load(cls, key, name) }, attr: { href: "#", title: name }"><span data-bind="text: name"/></a></li> \
           <!-- /ko --> \
        </ol>'
});
