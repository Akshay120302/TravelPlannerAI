import User from '../models/User.model.js';
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {

    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) return next(errorHandler(401, 'Invalid Password!'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)

        // remove or destructure the password before passing the info to the client, so that the password isn't leaked.
        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        // console.log('Received request body:', req.body); // Log the received data
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            console.log("User is already here")
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            // console.log("Creating new user");
            // console.log("Recieving new user's photo:", req.body.photo)
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);

        }
    } catch (error) {
        next(error);
    }
}


export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
}



//  const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
// this generates a JWT for authenticated user.
// jwt.sign: creates a new JWT based on the payload and the secret key.
// Payload: id: validUser._id -> payload is an obj. containing data that you want to include in the token. Here, it means that the token will contain the user's unique identifier '_id'.
// The secret key is used to sign the token, ensures that the token can be verified and trusted because only the server knows this key.

// This line will create a jwt which includes the user's ID in its payload.
// The generated token can be used to authenticate the user in subsequent reqs. It acts as a proof that the user has been authenticated and authorized.
// THe token is signed with the secret key which ensures its integrity. only the server has the secret key can verify and validate the token.
// *********** This line creates a secure, signed JWT containing the user's ID, using a secret key from the environment variables. The token can then be used to authenticate the user in future requests, allowing for stateless, scalable authentication in the application.


// res.cookie('access_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
// res.cookie -> used to set cookies on the client's browser.
// access_token -> name of the cookie.
// token -> this is the value of the cookie. Here, token is the JWT that was generated earlier using jwt.sigm.
// httpOnly: true -> a cookie option, makes the cookie accessible only through HTTPs reqs, not via client-side JS, mitigates the risk of XSS attacks.
// ************ This line sets an access_token cookie with the JWT as its value. The cookie is configured to be HTTP-only, providing security against XSS attacks, and is set to expire after 24 hours. This allows the server to identify and authenticate the user in subsequent requests without requiring the user to log in again within the cookie's lifespan.


//  const { password: pass, ...rest } = user._doc;
// The main purpose of this line is to exclude the password from the user data that will be sent in the response. It ensures that sensitive information like the user's password is not exposed in the JSON response.
// pass containing the user's password (not used further in the response).
// rest containing all the other properties of the user, which is then sent back to the client in the response.
// EXAMPLE:
// const user = {
//     _doc: {
//         email: 'example@example.com',
//         username: 'exampleuser',
//         password: 'hashedpassword123',
//         avatar: 'avatarurl'
//     }
// };

// const { password: pass, ...rest } = user._doc;

// console.log(pass);  // 'hashedpassword123'
// console.log(rest);  // { email: 'example@example.com', username: 'exampleuser', avatar: 'avatarurl' }
