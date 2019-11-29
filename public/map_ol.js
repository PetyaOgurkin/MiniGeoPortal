const WMS_URL = document.querySelector('#wms_url').value + "?";
const TILE = document.querySelector('#tile').value;
const PROJECTION_CODE = 'EPSG:' + document.querySelector('#projection').value;

async function getLayers() {
    const parser = new ol.format.WMSCapabilities();
    const capabilities = WMS_URL + "SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities";
    const result = parser.read(await fetch(capabilities).then(res => res.text()));

    return {
        layersName: result.Capability.Layer.Layer.map(layer => layer.Name).reverse(),
        layersTitle: result.Capability.Layer.Layer.map(layer => layer.Title).reverse(),
    }
}

const layersGroup = layers => {
    return layers.map(layer => {
        return new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: WMS_URL,
                params: {
                    'LAYERS': layer,
                    'TILED': true,
                    'CRS': PROJECTION
                },
                transition: 0,
                projection
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

let tiled = [];
let projection, extent;

switch (PROJECTION_CODE) {
    case 'EPSG:3857':
        projection = ol.proj.get(PROJECTION_CODE);
        if (TILE !== 'empty') {
            tiled = [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ]
        }
        break;
    case 'EPSG:4326':
        projection = ol.proj.get(PROJECTION_CODE);

        break;
    case 'EPSG:3576':

        proj4.defs("EPSG:3576", "+proj=laea +lat_0=90 +lon_0=0 +x_0=90 +y_0=0 +datum=WGS84 +units=m +no_defs");
        ol.proj.proj4.register(proj4);

        extent = [-4859377.085, -7109342.085, 5159377.085, 2909412.085]
        projection = new ol.proj.Projection({
            code: PROJECTION_CODE,
            extent,
            global: false,
            units: 'm'
        });

        let lvls;

        if (TILE !== 'empty') {

            let tiled_url;
            switch (TILE) {
                case 'topo':
                    tiled_url = 'http://monitor.krasn.ru/tiles/topo/{z}/{x}/{-y}.png';
                    lvls = 17;
                    break;
                case 'sentinel':
                    tiled_url = 'http://monitor.krasn.ru/tiles/sentinel2016/{z}/{x}/{-y}.jpeg';
                    lvls = 12;
                    break;
                case 'relief_dark':
                    tiled_url = 'http://monitor.krasn.ru/tiles/relief_dark/{z}/{x}/{-y}.jpeg';
                    lvls = 13;
                    break;
                default:
                    console.log('err');
                    break;
            }


            const startResolution = 19567.87923828125;
            const resolutions = [];
            for (let i = 0; i < lvls; i++) {
                resolutions.push(startResolution / Math.pow(2, i));
            }
            console.log(resolutions);

            tiled = [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: tiled_url,
                        projection,
                        tileGrid: new ol.tilegrid.TileGrid({
                            extent,
                            resolutions,
                            origin: ol.extent.getTopLeft(extent)
                        })
                    })
                })
            ]
        }
        break;
}

const map = new ol.Map({
    layers: tiled,
    target: 'map',
    view: new ol.View({
        center: [0, 0],
        zoom: 3,
        projection,
        extent
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

                const url = layer.getFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), PROJECTION_CODE,
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
