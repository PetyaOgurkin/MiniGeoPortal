function declension(value) {
    let tmp = +value.toString().slice(-2);
    if (tmp < 10 || tmp > 20) {
        if (tmp > 20) {
            tmp = +value.toString().slice(-1);
        }

        if (tmp === 0 || tmp > 4) {
            return 'ов';
        }
        else if (tmp === 1) {
            return '';
        }
        else {
            return 'а';
        }
    }
    else {
        return 'ов';
    }
}

function loginValidate(value, pattern) {

    const len = pattern.split('{').pop().slice(0, -1).split(',');

    if (value.length < +len[0]) {
        return `Минимальная длинна логина ${+len[0]} символ${declension(+len[0])}`
    }

    if (value.length > +len[1]) {
        return `Максимальная длинна логина ${+len[1]} символ${declension(+len[1])}`
    }

    return 'Логин должн состоять только из латинских букв и цифр'
}

function passwordValidate(value, pattern) {

    const len = pattern.split('{').pop().slice(0, -1).split(',');

    if (value.length < +len[0]) {
        return `Минимальная длинна пароля ${+len[0]} символ${declension(+len[0])}`
    }

    if (value.length > +len[1]) {
        return `Максимальная длинна пароля ${+len[1]} символ${declension(+len[1])}`
    }

    return 'Пароль не может содержать кирилицу'
}

function textAreaValidate(value, min, max, name) {

    if (value.length < min) {
        return `Минимальная длинна поля "${name}" ${min} символ${declension(+min)}`;
    }

    if (value.length > max) {
        return `Максимальная длинна поля "${name}" ${max} символ${declension(+max)}`;
    }

    return `Недопустимое значение поля "${name}"`;
}

function fileValidate(value) {
    const maxSize = 20;
    const mimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const errors = [];

    if (!value) {
        return ['Файл изображения не выбран'];
    }

    if (value.size / 1024 / 1024 > maxSize) {
        errors.push(`Максимальный размер файла ${maxSize} мегабайт`);
    }

    if (mimeTypes.indexOf(value.type) === -1) {
        errors.push('Недопустимый формат файла');
    }

    return errors;
}

export { loginValidate, passwordValidate, textAreaValidate, fileValidate };