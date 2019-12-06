import { textAreaValidate, fileValidate } from './model.js';

const form = document.querySelector('#form_add');

const title = document.querySelector('#title');
const discription = document.querySelector('#discription');
const url = document.querySelector('#url');
const img = document.querySelector('#img');

form.addEventListener('submit', e => {

    const errors = [];

    if (!title.checkValidity()) {
        errors.push(textAreaValidate(title.value, +title.getAttribute('minlength'), +title.getAttribute('maxlength'), 'Название карты'));
    }

    if (!discription.checkValidity()) {
        errors.push(textAreaValidate(discription.value, +discription.getAttribute('minlength'), +discription.getAttribute('maxlength'), 'Описание'));
    }

    if (!url.checkValidity()) {
        errors.push('Некорректный WMS URL');
    }

    errors.push(...fileValidate(img.files[0]));

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
