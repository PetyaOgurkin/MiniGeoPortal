function loginValidate(value, patern) {

    const len = patern.split('{').pop().slice(0, -1).split(',');

    if (value.length < +len[0]) {
        return `Минимальная длинна имени ${+len[0]} символов`
    }

    if (value.length > +len[1]) {
        return `Максимальная длинна имени ${+len[1]} символов`
    }

    return 'Имя должно состоять только из латинских букв и цифр'

}

function passwordValidate(value, patern) {

    const len = patern.split('{').pop().slice(0, -1).split(',');

    if (value.length < +len[0]) {
        return `Минимальная длинна пароля ${+len[0]} символов`
    }

    if (value.length > +len[1]) {
        return `Максимальная длинна пароля ${+len[1]} символов`
    }

    return 'Пароль не может содержать кирилицу'

}

function textAreaValidate(value, min, max, name) {

    if (value.length < min) {
        return `Минимальная длинна поля "${name}" ${min} символов`;
    }

    if (value.length > max) {
        return `Максимальная длинна поля "${name}" ${max} символов`;
    }

    return `Неверное значение поля "${name}"`
}

function fileValidate(value) {
    const maxSize = 20971520;
    const mimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const errors = [];

    if (!value) {
        return ['Выберите файл изображения'];
    }

    if (value.size > maxSize) {
        errors.push('Максимальный размер файла 20 мегабайт');
    }

    if (mimeTypes.indexOf(value.type) === -1) {
        errors.push('Недопустимый формат файла');
    }

    return errors;
}


export { loginValidate, passwordValidate, textAreaValidate, fileValidate };