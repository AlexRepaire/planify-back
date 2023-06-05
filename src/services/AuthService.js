import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { } from 'dotenv/config';

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body.user;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Informations' }] })
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Informations' }] })
        }

        const payload = {
            user: {
                id: user.id //mongoose abstraction , pas besoin d'utiliser le _id
            }
        }
        jwt.sign(payload, /*config.get('jwtSecret')*/ process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const signup = (req, res, next) => {
    console.log('req.body', req.body);

    const { email, password, firstName, lastName } = req.body;

    User.findOne({ email })
        .then(dbUser => {
            if (dbUser) {
                return res.status(409).json({ message: "email already exists" });
            } else if (req.body.email && req.body.password) {
                // password hash
                bcryptjs.hash(req.body.password, 12, (err, passwordHash) => {
                    if (err) {
                        return res.status(500).json({ message: "couldnt hash the password" });
                    } else if (passwordHash) {
                        return User.create(({
                            email,
                            lastName,
                            firstName,
                            password: passwordHash,
                        }))
                            .then(() => {
                                res.status(200).json({ message: "user created" });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(502).json({ message: "error while creating the user" });
                            });
                    };
                });
            } else if (!password) {
                return res.status(400).json({ message: "password not provided" });
            } else if (!email) {
                return res.status(400).json({ message: "email not provided" });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
};

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'here is your resource' });
    };
};

export default { login, signup, isAuth };