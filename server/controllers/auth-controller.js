const auth = require("../auth/index");
const User = require("../models/mysql/user.model");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

getLoggedIn = (req, res) => {
    console.log();
};

registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password, password2 } =
            req.body;
        console.log(
            "create user: " +
                firstName +
                " " +
                lastName +
                " " +
                email +
                " " +
                password +
                " " +
                password2
        );
        if (
            !username ||
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !password2
        ) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res.status(400).json({
                errorMessage:
                    "Please enter a password of at least 8 characters.",
            });
        }
        console.log("password long enough");
        if (password !== password2) {
            return res.status(400).json({
                errorMessage: "Please enter the same password twice.",
            });
        }
        console.log("password and password verify match");
        let existingUser = await User.findOne({
            where: {
                email: email,
            },
        });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                errorMessage:
                    "An account with this email address already exists.",
            });
        }
        existingUser = await User.findOne({
            where: {
                username: username,
            },
        });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                errorMessage: "An account with this username already exists.",
            });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const savedUser = await User.create({
            email: email,
            fname: firstName,
            lname: lastName,
            password_hash: passwordHash,
            username: username,
        });
        console.log("new user saved: " + savedUser._id);

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);
        console.log("token:" + token);

        await res
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                SameSite: "None",
            })
            .status(200)
            .json({
                success: true,
                user: savedUser.dataValues,
            });

        console.log("token sent");
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

/**
 * inspect if the jwt is valid
 */
getLoggedIn = async (req, res) => {
    console.log("IN GET LOGGED IN");
    try {
        let userId = auth.verifyUser(req);
        console.log("ID: " + userId);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?",
            });
        }

        const loggedInUser = await User.findByPk(userId);
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.fname,
                lastName: loggedInUser.lname,
                email: loggedInUser.email,
                username: loggedInUser.username,
            },
        });
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
};

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({
            where: { email: email },
        });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res.status(401).json({
                errorMessage: "Wrong email or password provided.",
            });
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password_hash
        );
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res.status(401).json({
                errorMessage: "Wrong email or password provided.",
            });
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
        })
            .status(200)
            .json({
                success: true,
                user: {
                    username: existingUser.username,
                    firstName: existingUser.fname,
                    lastName: existingUser.lname,
                    email: existingUser.email,
                },
            });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        SameSite: "none",
    }).send();
};

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
};
