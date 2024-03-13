const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env?.TIPTAP_COLLAB_SECRET
async function collaborationController(req, res) {
  let {
    channel,
  } = req.body;
  console.log(channel)
  const jwt = await jsonwebtoken.sign(
    {
      sub: conversationId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
      aud: "centrifugo",
      iss: "centrifugo",
      /* object to be encoded in the JWT */
      channels: [channel]
    },
    JWT_SECRET,
  )

  res.send(JSON.stringify({ token: jwt }));
}

module.exports = collaborationController;
