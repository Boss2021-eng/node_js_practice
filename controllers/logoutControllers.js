// const userDB = {
//   //   users: require('../model/users.json'),
//   users: require('../model/users.json'),
// };
// const setUsers = (data) => {
//   userDB.users = data;
// };

// const fsPromises = require('fs').promises;
// const path = require('path');

const User = require('../model/User');

const handleLogout = async (req, res) => {
  // On client, also delete the request token

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //no content
  }
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();

  //   is refresh token in db
  if (!foundUser) {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return res.statusCode(204);
  }

  // delete refresh token in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.sendStatus(404);
};

module.exports = { handleLogout };
