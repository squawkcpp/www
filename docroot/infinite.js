var API_URI="http://192.168.0.1:9001/";

// knockout-js-infinite-scroll (common usage)
ViewModel = function () {
    var self = this;

    self.items = ko.observableArray();
    self.items.extend({
        infinitescroll: {}
    });

    // detect resize
    $(window).resize(function() {
        updateViewportDimensions();
    });

    // tell infinte-scroll about the current scroll position
    // (debounce is important for ie11 smooth scroll problems! and also generally nicer in all browsers)
    $('#itemsUL').scroll(function() {
       self.items.infinitescroll.scrollY($('#itemsUL').scrollTop());

        // add more items if scroll reaches the last 100 items
        if (self.items.peek().length - self.items.infinitescroll.lastVisibleIndex.peek() <= 100) {
            populateItems(100);
        }
    });

    // update dimensions of infinite-scroll viewport and item
    function updateViewportDimensions() {
        var itemsRef = $('#itemsUL'),
            itemRef = $('.item').first(),
            itemsWidth = 240,
            itemsHeight = 300,
            itemWidth = 220,
            itemHeight = 20;

        self.items.infinitescroll.viewportWidth(itemsWidth);
        self.items.infinitescroll.viewportHeight(itemsHeight);
        self.items.infinitescroll.itemWidth(itemWidth);
        self.items.infinitescroll.itemHeight(itemHeight);

    }
    updateViewportDimensions();

    // init items
    function populateItems(numTotal) {
        $.get("http://192.168.0.1:9001/album/nodes" +
              "?index=" + "0" + //TODO ((self.paginationModel.page()-1)*self.paginationModel.pageSize()) +
              "&count="+ "-1", //TODO self.paginationModel.pageSize()
              function(data) { //TODO ADD FILTER
                self.items([]);
                for( i=0; i<data.nodes.length; i++ ) {
                    self.items.push(data.nodes[i]);
                }
              }
        );
    }
    populateItems();
}

ko.applyBindings(new ViewModel());
