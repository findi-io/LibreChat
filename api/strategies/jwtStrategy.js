const { Strategy: JwtStrategy } = require('passport-jwt');
const { logger } = require('~/config');
const User = require('~/models/User');
const cookies = require('cookie');

// JWT strategy
const jwtLogin = async () =>
  new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        const userCookie = cookies.parse(req.headers.cookie);
        if (userCookie.__session) {
          return userCookie.__session;
        }
        return null;
      },
      secretOrKey: atob(process.env.CLERK_PEM_PUBLIC_KEY),
    },
    async (payload, done) => {
      console.log(payload);
      let id = payload.id;
      if (payload.orgId) {
        id = payload.orgId;
      }
      try {
        const user = await User.findOne({ username: id });
        if (user) {
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
