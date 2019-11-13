const User = require('./models/users');
const bcrypt = require('bcryptjs');

async function create() {
    try {
        const hashPassword = await bcrypt.hash("mod", 10);
        await User.create({
            name: "mod",
            password: hashPassword,
            permission_level: 2
        });

    } catch (error) {
        console.error(error);
    }
}

create();


