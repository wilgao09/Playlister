const jwt = require("jsonwebtoken");
const config = require("../../config.json");

function authManager() {
    verify = (req, res, next, optional = false) => {
        try {
            const token = req.cookies.token;
            console.log("req.cookies looks like");
            console.log(req.cookies);
            if (!token) {
                if (optional) return next();
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized",
                });
            }
            console.log("verify the cookie");
            const verified = jwt.verify(token, config.jwtSecret);
            console.log("verified.userId: " + verified.userId);
            req.username = verified.userId;
            next();
        } catch (err) {
            console.error(err);
            if (optional) {
                return next();
            }
            return res.status(403).json({
                loggedIn: false,
                user: null,
                errorMessage: "Unauthorized",
            });
        }
    };

    verifyUser = (req) => {
        try {
            const token = req.cookies.token;
            console.log("got token " + token);
            if (!token) {
                return null;
            }
            // console.log("about to decode???");
            const decodedToken = jwt.verify(token, config.jwtSecret);
            // console.log("decoded token");
            // console.log(decodedToken);
            return decodedToken.userId;
        } catch (err) {
            return null;
        }
    };

    /**
     *
     * JWT token is userid only (no ttl)
     */
    signToken = (userId) => {
        return jwt.sign(
            {
                userId: userId,
            },
            config.jwtSecret
        );
    };

    return this;
}

const auth = authManager();
module.exports = auth;
