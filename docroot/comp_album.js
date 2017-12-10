<script type="text/html" id="album-template">
<div class="container-fluid squawkExpandable">
<!--  a href="#close-jump-1" class="expand__close"></a -->
<div class="row expandableGridImage">
<div class="col-md-6 squawkAlbumImage">
    <img class="img-fluid" data-bind='attr: {src: API_URI+med()}'></img>
    <!-- ul id="gallery" class="" data-bind="foreach: {data: covers}">
        <li class="" data-bind='attr: {"data-src": API_URI+"/res/"+key+ext}'>
            <a href="#"><img class="img-responsive" data-bind='attr: {src: API_URI+"/img/tn_"+key+".jpg"}' -->
            <!-- div class="demo-gallery-poster"><img data-bind='attr: {src: "http://sachinchoolur.github.io/lightGallery/static/img/zoom.png"}'></div -->
            <!-- /a>
        </li>
    </ul -->
</div>

<div class="col-md-6">
    <div class="row">
        <div class="col-md-12">
            <h4 class="text-white" data-bind="text: name"/><span class="text-white" data-bind="text: artist"/><br/><span class="text-white" data-bind="text: year"/>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <table class="table table-inverse table-striped table-sm songTable">
            <thead>
            <tr><th>#</th><th>Title</th><th>length</th><th>Bitrate</th><th>Samplerate</th><th>Bps.</th><th>Channels</th></tr>
            <thead>
            <tbody data-bind="foreach: {data: audiofiles}">
            <tr>
            <td data-bind="text: track"/>
            <td data-bind="text: name"/>
            <td data-bind="text: playlength"/>
            <td data-bind="text: bitrate"/>
            <td data-bind="text: samplerate"/>
            <td data-bind="text: bps"/>
            <td data-bind="text: channels"/>
            </tr>
            </tbody>
            </table>
        </div>
    </div>
</div>
</div>
</script>
