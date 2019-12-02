const User = require('./models/users');
const bcrypt = require('bcryptjs');

const validation = (val, min, max) => {
    if (!(val.match(/^[a-z0-9]+$/i) && val.length >= min && val.length <= max)) {
        return false
    }
    return true
}

async function acc() {
    let name, pass, perm;
    try {
        switch (process.argv[2]) {
            case '--add':

                name = process.argv[3];
                pass = process.argv[4];
                perm = process.argv[5];

                if (name) {
                    if (!validation(name, 3, 255)) {
                        return console.log('некорректоное имя пользователя');
                    }

                    const user = await User.findOne({ where: { name: name.toLowerCase() }, raw: true });
                    if (user) {
                        return console.log('пользователь с таким именем уже существует');
                    }

                    if (pass) {
                        if (!validation(pass, 3, 255)) {
                            return console.log('некорректный пароль');
                        }

                        const hashPassword = await bcrypt.hash(pass, 10);

                        if (perm) {
                            if (['1', '2', '3'].indexOf(perm) !== -1) {
                                await User.create({
                                    name: name.toLowerCase(),
                                    password: hashPassword,
                                    permission_level: perm
                                });
                                return console.log('пользователь создан');
                            }
                            else {
                                return console.log('некорректное значения уровня доступа');
                            }
                        }
                        else {
                            return console.log('введите уровень доступа');
                        }
                    }
                    else {
                        return console.log('введите пароль');
                    }
                }
                else {
                    return console.log('введите имя пользователя');
                }

            case '--remove':

                name = process.argv[3];
                if (name) {
                    const user = await User.findOne({ where: { name: name.toLowerCase() } });
                    if (user) {
                        await user.destroy();
                        return console.log(`пользователь '${name}' успешно удален`);
                    }
                    return console.log('пользователь с таким именем уже существует');
                }
                else {
                    return console.log('введите имя пользователя');
                }

            case '--changepassword':
                name = process.argv[3];
                pass = process.argv[4];

                if (name) {

                    const user = await User.findOne({ where: { name: name.toLowerCase() } });
                    if (user) {

                        if (pass) {
                            if (!validation(pass, 3, 255)) {
                                return console.log('некорректный пароль');
                            }

                            const hashPassword = await bcrypt.hash(pass, 10);

                            user.password = hashPassword;
                            await user.save();
                            return console.log('пароль изменен');
                        }
                        else {
                            return console.log('введите пароль');
                        }
                    }
                    else {
                        return console.log('такого пользователя не существует');
                    }
                }
                else {
                    return console.log('введите имя пользователя');
                }

            case '--changepermission':
                name = process.argv[3];
                perm = process.argv[4];

                if (name) {

                    const user = await User.findOne({ where: { name: name.toLowerCase() } });
                    if (user) {
                        if (perm) {
                            if (['1', '2', '3'].indexOf(perm) !== -1) {
                                user.permission_level = perm;
                                await user.save();
                                return console.log('уровень доступа изменен');
                            }
                            else {
                                return console.log('некорректное значения уровня доступа');
                            }
                        }
                        else {
                            return console.log('введите уровень доступа');
                        }
                    }
                    else {
                        return console.log('такого пользователя не существует');
                    }
                }
                else {
                    return console.log('введите имя пользователя');
                }

            case '--help':
                console.log('---------------------------------------------------------------------');
                console.log('список команд:');
                console.log('--add [name] [password] [permission]', ' -- создать пользователя с именем [name], паролем [password], уровенм доступа [permission]');
                console.log('--remove [name]', ' -- удалить пользователя с именем [name]');
                console.log('--changepassword [name] [password]', ' -- изменить пароль для пользователя [name] на [pass]');
                console.log('--changepermission [name] [permission]', ' -- изменить уровень доступа для пользователя [name] на [permission]');
                console.log('---------------------------------------------------------------------');
                console.log('[name] - имя пользователя (минимальная длина 3 символа, только латинские буквы и цифры)');
                console.log('[password] - пароль (минимальная длина 3 символа, только латинские буквы и цифры)');
                console.log('[permission] - уровень доступа (1 - обычный пользователь, 2 - редактор, 3 - администратор)');
                console.log('---------------------------------------------------------------------');
            default:
                break;
        }
    } catch (error) {
        console.error(error);
    }
}

acc();


