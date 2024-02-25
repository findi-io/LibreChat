const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { logger } = require('~/config');
const User = require('~/models/User');
const cookies = require('cookie');
const jwt = require('jsonwebtoken');

// JWT strategy
const jwtLogin = async () =>
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        const user = await User.findById(payload?.id);
        if (user) {
          const userCookie = cookies.parse(req.headers.cookie);
          if (userCookie.__session) {
            // there is session cookie
            const payload = jwt.verify(
              userCookie.__session,
              atob(process.env.CLERK_PEM_PUBLIC_KEY),
            );
            user.sender = payload.name;
          }
          done(null, user);
        } else {
          logger.warn('[jwtLogin] JwtStrategy => no user found: ' + payload?.id);
          done(null, false);
        }
      } catch (err) {
        done(err, false);
      }
    },
  );

module.exports = jwtLogin;
