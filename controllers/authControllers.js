// const userDB = {
//   //   users: require('../model/users.json'),
//   users: require('../model/users.json'),
// };
// const setUsers = (data) => {
//   userDB.users = data;
// };

const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //unauthorized
  const match = await bcrypt.compare(pwd, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);
    //create JWTs
    const accessToken = jwt.sign(
      { userInfo: { username: foundUser.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '59s' }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    //saving refreshToken with current user
    // const otherUsers = userDB.users.filter(
    //   (person) => person.username !== foundUser
    // );
    // const currentUser = { ...foundUser, refreshToken };
    // setUsers([...otherUsers, currentUser]);

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    // await fsPromises.writeFile(
    //   path.join(__dirname, '..', 'model', 'users.json'),
    //   JSON.stringify(userDB.users)
    // );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
