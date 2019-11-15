const WMS_URL = document.querySelector('#wms_url').value + "?";

async function getLayers() {
    const parser = new ol.format.WMSCapabilities();
    const capabilities = WMS_URL + "SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities";
    const result = parser.read(await fetch(capabilities).then(res => res.text()));


    const wmsSource = new ol.source.ImageWMS({
        url: WMS_URL,
        params: { 'LAYERS': result.Capability.Layer.Layer.map(layer => layer.Name).reverse().join(',') },
        transition: 0
    });
    var graphicUrl = wmsSource.getLegendUrl(map.getView().getResolution());
    console.log(graphicUrl);
    document.querySelector('#legend').src = graphicUrl;


    return result.Capability.Layer.Layer.map(layer => layer.Name).reverse();
}

const layersGroup = layers => {
    return layers.map(layer => {
        return new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: WMS_URL,
                params: {
                    'LAYERS': layer,
                    'TILED': true
                },
                transition: 0
            }),
        })
    })
}


async function init() {

    const layers = await getLayers();
    map.addLayer(new ol.layer.Group({
        layers: layersGroup(layers)
    }))
    return layers;
}

const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([110, 70]),
        zoom: 3
    })
});

init().then((layers) => {
    const check = document.querySelector("#check");
    check.innerHTML = "";
    layers.forEach(layer => {
        check.innerHTML += `
        <div>
          <label>
            <input type="checkbox" id="${layer}" class="filled-in" checked="checked" />
            <span>${layer}</span>
          </label>
          </div>`
    })

    check.querySelectorAll("input[type=checkbox]").forEach(node => {
        node.addEventListener('change', function () {
            map.getLayers().forEach(layer => {
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(sublayer => {
                        if (sublayer.getSource().getParams().LAYERS === node.id) {
                            if (this.checked) {
                                sublayer.setVisible(true);
                            }
                            else {
                                sublayer.setVisible(false);
                            }
                        }
                    });
                }
            });
        })
    })


    map.on('singleclick', function (evt) {

        map.forEachLayerAtPixel(evt.pixel, function (feature) {
            const layer = feature.getSource();

            if (layer.getUrls().indexOf(WMS_URL) != -1) {
                const url = layer.getFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 'EPSG:3857',
                    { 'INFO_FORMAT': 'text/html' });

                if (url) {
                    fetch(url)
                        .then(function (response) { return response.text(); })
                        .then(function (html) {
                            document.getElementById('info').innerHTML = html;
                        });
                }
            }
        });
    });

})








