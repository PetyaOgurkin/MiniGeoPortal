const User = require('./models/users');
const bcrypt = require('bcryptjs');

async function create(name, pass, perm) {
    try {
        const hashPassword = await bcrypt.hash(pass, 10);
        await User.create({
            name,
            password: hashPassword,
            permission_level: perm
        });

    } catch (error) {
        console.error(error);
    }
}

create("admin", "admin", 3);
create("mod", "mod", 2);
create("user", "user", 1);
console.log("done");



