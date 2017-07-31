function SquawkModel() {
    var self = this;
    self.page = ko.observable();
    self.key = ko.observable( "/" );
    self.cls = ko.observable();
    self.path = new PathModel();

    self.load = function( cls, key, name ) {
        console.log( "load: " + cls + " " + key );
        self.cls( cls );
        self.key( key );
        self.page( self.cls() + "-page-widget" );
        self.path.push( {cls: cls, key: key, name: name } );
    }

    self.style = function (data) {
        return ko.computed({
            read: function () {
                if( data.key == "/photo" ) {
                    return "fa fa-camera-retro fa-5x";
                } else if( data.key == "album" ) {
                    return "fa fa-music fa-5x";
                } else if( data.key == "ebook" ) {
                    return "fa fa-book fa-5x";
                } else if( data.key == "artist" ) {
                    return "fa fa-users fa-5x";
                } else if( data.key == "serie" ) {
                    return "fa fa-television fa-5x";
                } else if( data.key == "movie" ) {
                    return "fa fa-film fa-5x";
//                } else if( data.key == "fs" ) {
//                    return "fa fa-folder fa-5x";
                } else if( data.key == "photo" ) {
                    return "fa fa-photo fa-5x";

                } else if( data.cls == "folder" ) {
                    return "fa fa-folder fa-5x";
                } else if( data.cls == "album" ) {
                    return "fa fa-music fa-5x";
                } else if( data.cls == "audio" ) {
                    return "fa fa-file-audio-o fa-5x";
                } else if( data.cls == "movie" ) {
                    return "fa fa-file-video-o fa-5x";
                } else if( data.cls == "image" ) {
                    return "fa fa-file-image-o fa-5x";
                } else return "fa fa-file fa-5x";
            },
            write: function (cls) {}
        }, this);
    };
    self.load( "folder", "/", "root" );
}

function initializeModel() {
    var squawkModel = new SquawkModel();
    ko.applyBindings(squawkModel);
}
initializeModel();
