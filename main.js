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
.get("/", () => "https://github.com/metadream/bark-server")
.get("/ping", bark.ping)
.get("/register", bark.register)
.post("/:key", bark.push)
.listen();