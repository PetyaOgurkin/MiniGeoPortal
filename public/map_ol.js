const WMS_URL = 'http://172.16.132.45/qgis/ru1/rus-shp1?';

/* const getLayers = () => {
    var parser = new ol.format.WMSCapabilities();
    const capabilities = "http://172.16.132.45/qgis/ru1/rus-shp1?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities";

    fetch(capabilities, { mode: "cors" }).then(function (response) {
        return response.text();
    }).then(function (text) {
        //   var result = parser.read(text);
        console.log(text);
    });
} */


const layersNames = ['rus_regions', 'dneta15w', 'dnetl15w', 'rlrdl_10ml', 'nnp_10ml'];
const layersGroup = [];

layersNames.forEach(layer => {
    layersGroup.push(
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://172.16.132.45/qgis/ru1/rus-shp1?',
                params: {
                    'LAYERS': layer,
                    'TILED': true
                },
                transition: 0
            }),
        })
    )
})

const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        new ol.layer.Group({
            layers: layersGroup
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([110, 70]),
        zoom: 3
    })
});



map.on('singleclick', function (evt) {

    map.forEachLayerAtPixel(evt.pixel, function (feature) {
        const layer = feature.getSource();

        if (layer.getUrls().indexOf(WMS_URL) != -1) {
            const url = layer.getFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 'EPSG:3857',
                { 'INFO_FORMAT': 'text/html' });

            if (url) {
              //  console.log(url);

                fetch(url)
                    .then(function (response) { return response.text(); })
                    .then(function (html) {
                        document.getElementById('info').innerHTML = html;
                    });
            }
        }
    });
});





const check = document.querySelector("#check");
check.innerHTML = "";
layersNames.forEach(layer => {
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