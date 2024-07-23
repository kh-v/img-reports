const {
    getUser,
    insertUser
} = require('../model/users')

const {
    encrypt
} = require('../utils/crypto')

const {
    loginCookies
} = require('../../backend/scanner')

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password, img_password } = req.body;
    if (!username || !password || !img_password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await getUser(username)
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        let user = await loginCookies(username, img_password, true)
        if (user) {
            user.img_password = encrypt(img_password)
            user.password = hashedPwd
            await insertUser(user)
            res.status(201).json({ 'success': `New user ${user.username} - ${user.name}  created!` });
        } else {
            res.status(401).json({ 'message': 'Invalid IMG credential' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { handleNewUser };