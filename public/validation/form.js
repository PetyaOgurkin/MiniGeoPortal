import { textAreaValidate, fileValidate } from './model.js';

const form = document.querySelector('#form_add');

form.addEventListener('submit', e => {

    const errors = [];

    form.querySelectorAll('[required]').forEach(element => {

        const fieldName = form.querySelector(`label[for="${element.id}"]`).innerHTML;
        switch (element.type) {
            case 'textarea':
                if (!element.checkValidity()) {
                    errors.push(textAreaValidate(element.value, +element.getAttribute('minlength'), +element.getAttribute('maxlength'), fieldName));
                }
                break;
            case 'url':
                if (!element.checkValidity()) {
                    errors.push('Некорректный WMS URL');
                }
                break;
            case 'file':
                if (form.getAttribute('data-action') === 'edit') {
                    if (element.files[0]) {
                        errors.push(...fileValidate(element.files[0]));
                    }
                }
                else if (form.getAttribute('data-action') === 'add') {
                    errors.push(...fileValidate(element.files[0]));
                }
                break;

            default:
                break;
        }
    })

     if (errors.length > 0) {
         errors.forEach((e, i) => {
             if (i > 0) {
                 errors[i] = e[0].toLowerCase() + e.slice(1);
             }
         });
 
         const alert = document.querySelector('.alert');
         if (!alert) {
             $('#form_add').before(`<p class="alert">${errors.join(', ')}.</p>`);
         }
         else {
             alert.innerHTML = errors.join(', ') + '.';
         }
 
         e.preventDefault();
     }
})
