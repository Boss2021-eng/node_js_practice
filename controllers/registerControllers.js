// const userDB = {
//   //   users: require('../model/users.json'),
//   users: require('../model/users.json'),
// };

const User = require('../model/User');
// const setUsers = (data) => {
//   userDB.users = data;
// };

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  // check for duplicate username
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) {
    return res.sendStatus(409); //conflict
  }

  try {
    // hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);
    res.status(201).json({ success: `New user ${user} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
