/**
 * Node.js implementation of the [bark-server](https://github.com/Finb/bark-server).
 * References: https://github.com/dss886/bark-server
 */
const apns = require("../providers/apns.js");
const coder = require('int-encoder');
coder.alphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");

/**
 * Heartbeat ping/pong
 * @returns
 */
exports.ping = function () {
  return { code: 200, message: "pong", timestamp: Date.now() };
}

/**
 * Register mobile device
 * @param {Context} ctx
 * @returns
 */
exports.register = async function (ctx) {
  const { deviceToken } = ctx.query;
  if (!deviceToken) {
    ctx.throw("Device token cannot be empty", 400);
  }

  const deviceKey = coder.encode(deviceToken, 16);
  return {
    code: 200, message: "success",
    data: { key: deviceKey, device_key: deviceKey, device_token: deviceToken }
  };
}

/**
 * Push message to apple server
 * @param {Context} ctx
 * @returns
 */
exports.push = async function (ctx) {
  const deviceKey = ctx.params.key;
  if (!deviceKey) {
    ctx.throw("Device key cannot be empty", 400);
  }
  const deviceToken = coder.decode(deviceKey, 16);
  if (deviceToken.length !== 64) {
    ctx.throw("Device key is not compliant", 400);
  }

  const req = await ctx.json();
  const payload = {
    aps: {
      // If the value of "mutable-content" is 1, the system passes the notification to
      // your notification service app extension before delivery.
      "mutable-content": 1,
      sound: ctx.query.sound || req.sound || "1107",
      category: ctx.query.category || req.category,
      alert: { title: req.title, body: req.body }
    },
    data: {
      url: ctx.query.url || req.url,
      badge: String(ctx.query.badge || req.badge),
      icon: ctx.query.icon || req.icon,
      group: ctx.query.group || req.group,
      level: ctx.query.level || req.level, // active (default), timeSensitive, passive
      copy: ctx.query.copy || req.copy,
      isarchive: ctx.query.is_archive || req.is_archive
    }
  };

  const result = await apns.push(deviceToken, payload);
  return { code: 200, message: result };
}