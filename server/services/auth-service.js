import passport from "passport";
import LocalStrategy from "passport-local";
import { getUserByCredentials } from "../dao/user-dao.js";
import { userEntityToResponseDTO } from "./mapper-service.js";
import { sendUnauthorizedError } from "./error-service.js";

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = userEntityToResponseDTO(await getUserByCredentials(username, password));
  if(!user) {
    //null -> no error, invalid credetials, message
    return cb(null, false, "Incorrect email or password"); // error message in the WWW-Authenticated header of the response
  }
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

export const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  //console.log(req.user);
  return sendUnauthorizedError("Not authorized", res);
}

export const authenticateSession = passport.authenticate("session");
export const authenticateLocal = passport.authenticate("local");