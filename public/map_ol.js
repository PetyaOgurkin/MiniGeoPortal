const WMS_URL = document.querySelector('#wms_url').value + "?";

async function getLayers() {
    const parser = new ol.format.WMSCapabilities();
    const capabilities = WMS_URL + "SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities";
    const result = parser.read(await fetch(capabilities).then(res => res.text()));

    return {
        layersName: result.Capability.Layer.Layer.map(layer => layer.Name).reverse(),
        layersTitle: result.Capability.Layer.Layer.map(layer => layer.Title).reverse(),
    }
}

function getLegend(layers) {
    layers.forEach(layer)
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
        layers: layersGroup(layers.layersName)
    }))
    return layers;
}


const tile = document.querySelector('#tile').value;
const proj = document.querySelector('#projection').value;
let tiled, projection;

switch (tile) {
    case 'osm':
        tiled = [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ]

        projection = ol.proj.get('EPSG:' + proj);
        break;
    case 'empty':
        tiled = [];
        projection = ol.proj.get('EPSG:' + proj);
        break;
    case 'topo':
        break;
    case 'relief_dark':
        break;
    case 'sentinel':
        break;
    default:
        break;
}

console.log(tiled);
console.log(projection);



const map = new ol.Map({
    target: 'map',
    layers: tiled,
    view: new ol.View({
        projection,
        center: ol.proj.fromLonLat([110, 70]),
        zoom: 3
    }),
    controls: ol.control.defaults().extend([new ol.control.ScaleLine()])
});

document.querySelector('#close_info').addEventListener('click', () => {
    document.querySelector('#infoHidden').classList.add('hidden');
})

document.querySelector('#legendBtn').addEventListener('click', () => {
    const legend = document.querySelector('#legendHidden');

    if (legend.classList.contains('hidden')) {
        document.querySelector('#legendHidden').classList.remove('hidden');
    }
    else {
        document.querySelector('#legendHidden').classList.add('hidden');
    }
})

init().then((layers) => {
    const check = document.querySelector("#check");
    check.innerHTML = "";
    layers.layersName.forEach((layer, idx) => {

        const wmsSource = new ol.source.ImageWMS({
            url: WMS_URL,
            params: {
                'LAYERS': layer
            },
            transition: 0
        });

        const legendSrc = wmsSource.getLegendUrl(map.getView().getResolution(), {
            'SYMBOLSPACE': 5,
            'ICONLABELSPACE': 3,
            'LAYERSPACE': 1,
            'LAYERFONTBOLD': false,
            'LAYERTITLE': false,
            'TRANSPARENT': true
        });

        check.innerHTML += `
            <div class="form-group custom-control custom-checkbox mr-sm-2" style='margin-bottom: 0.5rem'>
                <input class="custom-control-input" type="checkbox" id="${layer}" checked="checked">
                <label class="custom-control-label" for="${layer}"><h5>${layers.layersTitle[idx]}</h5></label>
                <div>
                    <img style='margin-top: -10px' src='${legendSrc}'>
                </div>
            </div>`;

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
        const info = document.getElementById('info');
        info.innerHTML = '';

        map.forEachLayerAtPixel(evt.pixel, function (feature) {
            const layer = feature.getSource();

            if (layer.getUrls().indexOf(WMS_URL) != -1) {

                const url = layer.getFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), 'EPSG:' + proj,
                    {
                        'INFO_FORMAT': 'text/xml'
                    });

                if (url) {
                    const parser = new DOMParser();

                    fetch(url)
                        .then(response => response.text())
                        .then(xml => {

                            const data = parser.parseFromString(xml, "text/xml");

                            const layerInfo = data.querySelector('Layer');

                            if (layerInfo.innerHTML !== '') {
                                const titleIdx = layers.layersName.findIndex(val => val === layerInfo.getAttribute('name'));

                                let html = `
                                    <h5 style='margin-bot: 2rem'>${layers.layersTitle[titleIdx]}</h5>
                                    <table class="table table-sm">
                                        <tbody>`;


                                layerInfo.querySelectorAll('Attribute').forEach(attr => {
                                    html += `
                                        <tr>
                                            <td>${attr.getAttribute('name')}</td>
                                            <td>${attr.getAttribute('value')}</td>
                                        </tr>`;
                                })

                                html += '</tbody></table>';
                                info.innerHTML += html;
                            }

                            if (info.innerHTML !== '') {
                                document.querySelector('#infoHidden').classList.remove('hidden')
                            }
                            else {
                                document.querySelector('#infoHidden').classList.add('hidden')
                            }
                        });
                }
            }
        });
    });

})








