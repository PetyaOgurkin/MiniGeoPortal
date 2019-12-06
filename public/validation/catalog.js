import { textAreaValidate, fileValidate } from './model.js';

const form = document.querySelector('#form_add');

const title = document.querySelector('#title');
const short_discription = document.querySelector('#short_discription');
const full_discription = document.querySelector('#full_discription');
const img = document.querySelector('#img');

form.addEventListener('submit', e => {

    const errors = [];

    if (!title.checkValidity()) {
        errors.push(textAreaValidate(title.value, +title.getAttribute('minlength'), +title.getAttribute('maxlength'), 'Название каталога'));
    }

    if (!short_discription.checkValidity()) {
        errors.push(textAreaValidate(short_discription.value, +short_discription.getAttribute('minlength'), +short_discription.getAttribute('maxlength'), 'Краткое описание'));
    }

    if (!full_discription.checkValidity()) {
        errors.push(textAreaValidate(full_discription.value, +full_discription.getAttribute('minlength'), +full_discription.getAttribute('maxlength'), 'Полное описание'));
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
