import User from "../models/UserModel.js";
import "dotenv/config.js";


const setBestScore = async (req, res) => {
  const { userId, userName, bestScore } = req.body;
  try {
    const user = await User.updateOne({ "userId": userId }, { userId, userName, bestScore });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

const getUserScore = async (req, res) => {
  const { userId, userName, bestScore } = req.body;
  const exist = await User.findOne({ userId });
    if (!exist) {
    try {
      const user = await User.create({ userId, userName, bestScore });
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(200).json(exist);
  }

}

export { setBestScore, getUserScore };
