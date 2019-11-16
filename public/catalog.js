const wms_btns = document.querySelectorAll('.wms-btn');

if (wms_btns[0]) {
    wms_btns.forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelector('#wms_url').value = this.attributes['data-id'].value;
        })
    })

    document.querySelector('#wms_copy').addEventListener('click', () => {
        document.querySelector('#wms_url').select();
        document.execCommand('copy');
    })
}

