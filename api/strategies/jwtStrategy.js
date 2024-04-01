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
        return userCookie.__session;
      },
      secretOrKey: atob(process.env.CLERK_PEM_PUBLIC_KEY),
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        let id = payload.id;
        if (payload.orgId) {
          id = payload.orgId;
        }
        const user = await User.findOne({ username: id.trim() });
        if (user) {
          user.sender = payload.name;
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
