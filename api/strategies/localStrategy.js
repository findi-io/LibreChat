const { errorsToString } = require('librechat-data-provider');
const { Strategy: PassportLocalStrategy } = require('passport-local');
const { loginSchema } = require('./validators');
const logger = require('~/utils/logger');
const User = require('~/models/User');
const cookies = require('cookie');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Transaction = require('~/models/Transaction');

async function validateLoginRequest(req) {
  const { error } = loginSchema.safeParse(req.body);
  return error ? errorsToString(error.errors) : null;
}

async function findUserByEmail(email) {
  return User.findOne({ username: email.trim() });
}

async function passportLogin(req, email, password, done) {
  try {
    const validationError = await validateLoginRequest(req);
    if (validationError) {
      logError('Passport Local Strategy - Validation Error', { reqBody: req.body });
      logger.error(`[Login] [Login failed] [Username: ${email}] [Request-IP: ${req.ip}]`);
      return done(null, false, { message: validationError });
    }
    logError('Passport Local Strategy - User Not Found', { email });
    logger.error(`[Login] [Login failed] [Username: ${email}] [Request-IP: ${req.ip}]`);
    const userCookie = cookies.parse(req.headers.cookie);
    if (userCookie.__session) {
      // there is session cookie
      // try to decode jwt
      try {
        const payload = jwt.verify(userCookie.__session, atob(process.env.CLERK_PEM_PUBLIC_KEY));
        console.log(payload);
        let id = payload.id;
        let name = payload.name;
        let avatar = payload.avatar;
        let email = payload.email;
        if (payload.orgId) {
          id = payload.orgId;
          name = payload.orgName;
          avatar = payload.orgAvatar;
          email = `${id}@dummy.email`;
        }
        const hash = bcrypt.hashSync(id, 10);
        let user = await findUserByEmail(id);
        if (!user) {
          user = await User.create({
            name: name,
            username: id,
            email: email,
            emailVerified: true,
            // file deepcode ignore NoHardcodedPasswords/test: fake value
            password: hash,
            avatar: avatar,
            provider: 'local',
            role: 'USER',
            plugins: [],
            refreshToken: [],
          });
          if (id.startsWith('user_')) {
            try {
              await Transaction.create({
                user: user._id,
                tokenType: 'credits',
                context: 'admin',
                rawAmount: 1000 * 1000,
              });
            } catch (error) {
              console.red('Error: ' + error.message);
              console.error(error);
            }
          }
        }

        logger.info(`[Login] [Login successful] [Username: ${email}] [Request-IP: ${req.ip}]`);
        return done(null, user);
      } catch (e) {
        console.log(e);
        return done(null, false, { message: 'failed to decode jwt token.' });
      }
    }
  } catch (err) {
    return done(err);
  }
}

function logError(title, parameters) {
  const entries = Object.entries(parameters).map(([name, value]) => ({ name, value }));
  logger.error(title, { parameters: entries });
}

module.exports = () =>
  new PassportLocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
      passReqToCallback: true,
    },
    passportLogin,
  );
