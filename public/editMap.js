const tile_box = document.querySelector('#tile');
const proj_box = document.querySelector('#projection');
const proj_hidden = document.querySelector('#projection_hidden');


proj_box.addEventListener('change', () => {
    proj_hidden.value = proj_box.value;
})

tile_box.addEventListener('change', () => {
    switch (tile_box.value) {
        case 'empty':
            $(proj_box).val('4326');
            proj_hidden.value = '4326';
            proj_box.disabled = false;
            break;
        case 'topo': case 'sentinel': case 'relief_dark':
            $(proj_box).val('3576');
            proj_hidden.value = '3576';
            proj_box.disabled = true;
            break;
        case 'osm':
            $(proj_box).val('3857');
            proj_hidden.value = '3857';
            proj_box.disabled = true;
            break;
        default:
            break;
    }
})