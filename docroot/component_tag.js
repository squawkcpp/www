ko.components.register('tag-widget', {
    viewModel: function(params) {
        var self = this;
        self.taglist = ko.observableArray();
        $.getJSON( API_URI+params.key()+"/taglist"+tag, function( data ) {
            ko.utils.arrayPushAll(_array, self.taglist);
        });

        ko.extenders.keyChange = function(target, option) {
            target.subscribe(function(newValue) {
                if( newValue == "album" ) {
                    console.log( "load tags: " + self.key() );
                    $.getJSON( API_URI+option.key()+"/name", function( data ) {
                        self.taglist([]);
                        ko.utils.arrayPushAll(self.taglist, data);
                    });
                }
            });
            return target;
        };
        self.key = params.key.extend( {keyChange: "key"} );
        self.valuelist = function (tag) {
            _array = ko.observableArray();
            $.getJSON( API_URI+option.key()+"/"+tag, function( data ) {
                _array([]);
                ko.utils.arrayPushAll(_array, data);
            });
            return _array;
        };
    },
template: 'xxxxx<ul class="nav justify-content-center" data-bind="foreach: valuelist"> \
<li class="nav-item dropdown"> \
  <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" aria-haspopup="true" aria-expanded="false" data-bind="text: $data"></a> \
  <div class="dropdown-menu" data-bind="foreach: $parent.valuelist( $data )"> \
        <a class="dropdown-item" href="#" data-bind="text: $data"></a> \
      </div> \
    </li> \
</ul>\
</div>'
});
