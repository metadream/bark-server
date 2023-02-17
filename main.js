const Cross = require("node-cross");
const bark = require("./bark.js");

new Cross()
.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  ctx.set("Access-Control-Allow-Headers", "Origin,Content-Type,Accept");
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
})
.get("/", () => "Repo: https://github.com/metadream/bark-server")
.get("/ping", bark.ping)
.get("/register", bark.register)
.get("/:key/:body", bark.push)
.get("/:key/:title/:body", bark.push)
.post("/:key/:body", bark.push)
.post("/:key/:title/:body", bark.push)
.post("/:key", bark.push)
.options("/:key", () => {})
.listen();