const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { logger } = require('~/config');
const User = require('~/models/User');

// JWT strategy
const jwtLogin = async () =>
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: atob(process.env.CLERK_PEM_PUBLIC_KEY),
    },
    async (payload, done) => {
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
