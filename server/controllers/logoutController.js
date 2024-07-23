const fsPromises = require('fs').promises;
const path = require('path');

const {
    getUser,
    updateUser
} = require('../model/users')

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await getUser(user) 
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    await updateUser(foundUser.username, '')

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }