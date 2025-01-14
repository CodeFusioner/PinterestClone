import bcrypt from 'bcrypt';
import { User } from "../models/userModel.js";
import generateToken from '../utils/generateToken.js';
// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        generateToken(user_id, res);
        res.status(201).json({
            user,
            message: "User Registered",
        });

    } catch (err) {
        console.error(err);
    }
}

// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({
                message: "No user with this mail",
            });

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword)
            return res.status(400).json({
                message: "Wrong password",
            });

        generateToken(user._id, res);

        res.json({
            user,
            message: "Logged in",
        });
    } catch (err) {
        console.error(err);
    }
}

// my profile

export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (err) {
        console.error(err);
    }
}

// userProfile
export const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err);
    }
}

// follow and unfollow user
export const followAndUnfollowUser = async(req, res)=> {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user)
        return res.status(400).json({
            message: "No user with this id",
        });

    if (user._id.toString() === loggedInUser._id.toString())
        return res.status(400).json({
            message: "you can't follow yourself",
        });

    if (user.followers.includes(loggedInUser._id)) {
        const indexFollowing = loggedInUser.following.indexOf(user._id);
        const indexFollowers = user.followers.indexOf(loggedInUser._id);

        loggedInUser.following.splice(indexFollowing, 1);
        user.followers.splice(indexFollowers, 1);

        await loggedInUser.save();
        await user.save();

        res.json({
            message: "User Unfollowed",
        });
    } else {
        loggedInUser.following.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        res.json({
            message: "User followed",
        });
    }
}

// logout user
export const logOutUser = async (req, res) => {
    res.cookie("token", "", { maxAge: 0 });

    res.json({
        message: "Logged Out Successfully",
    });
}

