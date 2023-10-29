// const todoList = require("../db/todo");
// const fs = require("fs");


// const checkTaskOwnership = async (req, res, next) => {
//   const taskId = req.params.id;
//   const userId = req.user._id; 

//   try {
//     const task = await todoList.findById(taskId);
//     if (!task || !task.userId.equals(userId)) {
//       return res.status(403).json({ error: "Unauthorized access to the task." });
//     }
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = { checkTaskOwnership };

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const authenticate = catchAsync(async (req, res, next) => {

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.session.token) {
    token = req.session.token;
    req.session.token = token;

  } else if (req.cookies.sessionId) {
    token = req.cookies.sessionId;
  }
  if (!token) {
    return next(
      new AppError(401, "You are not logged in! Please log in to get access")
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return next(new AppError(401, "Invalid token"));
  }
});

const auth = (req, res, next) => {
  authenticate(req, res, () => {

    if (req?.user) {
      next();
    } else {
      return res.redirect("/signup");
      //   return next(new AppError(403, 'Unauthorized'));
    }
  });
};

module.exports = { auth };
