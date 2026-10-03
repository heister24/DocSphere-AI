const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"];
    // console.log(userId);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing in gateway header",
      });
    }
    req.user = { _id: userId };
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authMiddleware;
