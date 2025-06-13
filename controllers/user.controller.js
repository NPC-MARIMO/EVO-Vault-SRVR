import bcrypt from 'bcryptjs';
import User from '../model/user.model.js';
import jwt from 'jsonwebtoken'

const register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Only for HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ message: 'Login successful', token, user });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const getUser = async (req,res) => {
        try {
            const user = await User.findById(req.user.id)
            if(!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message : "Heyy, You are logged in",    
                user : {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    avatar : user.avatar,
                    families : user.families,
                    bio : user.bio,
                    username : user.username,
                }
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
}



export { register, login, getUser }