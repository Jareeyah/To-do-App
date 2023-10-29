const express = require("express");
const controllers = require("./todo_controller");
const middleware = require("./todo_middleware");
const bodyParser = require("body-parser");
const router = express.Router();

router.post("/", bodyParser.json(),  middleware.auth, controllers.createTodo);
router.put("/:id", bodyParser.json(), middleware.auth, controllers.updateTodo);
router.delete("/:id", controllers.deleteTodo);

module.exports = router;


