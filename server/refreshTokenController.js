const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const {
    getUser,
    updateUser,
    insertUser,
    getUserByRefreshToken
} = require('../model/users')

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const { token } = req.query;
    const cookies = req.cookies;
    console.log(token, req.headers)
    if (!cookies?.jwt && !token) return res.sendStatus(401);
    const refreshToken = cookies.jwt || token;

    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await getUserByRefreshToken(refreshToken);
    console.log(foundUser)
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '480m' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }