import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretKey";

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
    };

    export default function initializePassport() {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.id).select("-password");
            if (user) return done(null, user);
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
        })
    );
}
