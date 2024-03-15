const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET = process.env?.TIPTAP_COLLAB_SECRET;
async function collaborationController(req, res) {
  const jwt = await jsonwebtoken.sign(
    {
      /* object to be encoded in the JWT */
    },
    JWT_SECRET,
  );

  res.send(JSON.stringify({ token: jwt }));
}

module.exports = collaborationController;
