/**
 * Apple Push Notification Service
 * Cert info from:
 * https://github.com/Finb/bark-server/blob/master/deploy/AuthKey_LH4T9V5U4R_5U8LBRXG3A.p8
 */
const { ApnsClient, Notification } = require("apns2");

const apns = new ApnsClient({
  keyId: "LH4T9V5U4R",
  team: "5U8LBRXG3A",
  defaultTopic: "me.fin.bark",
  signingKey: `
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg4vtC3g5L5HgKGJ2+
T1eA0tOivREvEAY2g+juRXJkYL2gCgYIKoZIzj0DAQehRANCAASmOs3JkSyoGEWZ
sUGxFs/4pw1rIlSV2IC19M8u3G5kq36upOwyFWj9Gi3Ejc9d3sC7+SHRqXrEAJow
8/7tRpV+
-----END PRIVATE KEY-----
`});

/**
 * Push message to device
 * @param {string} deviceToken
 * @param {object} payload
 * @returns
 */
apns.push = async function (deviceToken, payload) {
  return await apns.send(new Notification(deviceToken, payload));
}
module.exports = apns;