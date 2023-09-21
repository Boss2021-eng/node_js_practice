// const userDB = {
//   //   users: require('../model/users.json'),
//   users: require('../model/users.json'),
// };
// const setUsers = (data) => {
//   userDB.users = data;
// };
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  console.log(foundUser);

  if (!foundUser) return res.sendStatus(403); //forbidden
  console.log(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    console.log(decoded);
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); //forbidden
    }
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      { userInfo: { username: decoded.username, roles: roles } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30s' }
    );

    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
