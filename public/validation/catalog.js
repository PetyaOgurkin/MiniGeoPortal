import { textAreaValidate, fileValidate } from './model.js';

const form = document.querySelector('#form_add');

const title = document.querySelector('#title');
const short_discription = document.querySelector('#short_discription');
const full_discription = document.querySelector('#full_discription');
const img = document.querySelector('#img');

form.addEventListener('submit', e => {

    const errors = [];

    if (!title.checkValidity()) {
        errors.push(textAreaValidate(title.value, 3, 255, 'Название каталога'));
    }

    if (!short_discription.checkValidity()) {
        errors.push(textAreaValidate(short_discription.value, 3, 255, 'Краткое описание'));
    }

    if (!full_discription.checkValidity()) {
        errors.push(textAreaValidate(full_discription.value, 3, 3000, 'Полное описание'));
    }

    errors.push(...fileValidate(img.files[0]));

    if (errors.length > 0) {

        const alert = document.querySelector('.alert');
        if (!alert) {
            $('#form_add').before(`<p class="alert">${errors.join(', ')}</p>`);
        }
        else {
            alert.innerHTML = errors.join(', ');
        }

        e.preventDefault();
    }
})
