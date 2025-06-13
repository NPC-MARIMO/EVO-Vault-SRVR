const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false, // Prevent password from being sent in queries
    },
    avatar: {
        public_id: String,
        url: {
            type: String,
            default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAe1BMVEX///8BAQG2trb8/PwEBAT4+PhjY2Py8vLt7e1OTk5nZ2fl5eXg4ODZ2dm7u7vOzs6bm5ukpKQcHBwTExOJiYl+fn6vr68nJyeVlZV2dnbGxsYYGBhHR0fBwcHj4+ONjY1ubm4sLCw2NjY/Pz97e3siIiJVVVVAQEBSUlIituUvAAAEFklEQVR4nO3c23aiMBQG4EA4aUVqqed2qm3Vvv8TTgIeizLZiCvZzP9dzJre5e/eBJIGhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuE4qx/+L0/87JU4XQ3+4SGPbA3mIxJ8vvYN85Se2B9SyrO/9FmWiO72avalEQSVjL7M9sBboGsW6fkHwO6H+uc+/V1Ubvldqdx7znXurSvF8rT/Pyvhse4j30LV5vXoFHgLq1n0VfGuo2m9c16J7jCPWt+jJyPZAm8sMKqh/BRnLKqoWDV9MEip5yDKhUBdh5SZ4w7ft0TYhRWp0EZYGtofbSGQaT/0i+rYH28Qf44BlEfldih/m8dTlyvGmmJNqGNgeLl1KCuh5qe0Bk43MJ9ICvyfw6qK+HrfZVIpPYg0/uc00IeF2X+K2AZfQ4incNjSeyAmfbA+ZqPsJu9+lMTkhs5lGhkviXJqHtsdMI0WPmLBne8hkY2LCse0Bk/nEhL7tAZNRpxpmE432QwrI7zLUbWpM9fOE4RpfUq7DQPJLKNUa2LyG/Na/OmE4NZ5Op8xu9yX9t1HTPe9324NtQv9ld2VYwj6/i7Ak5dSgioG3tj3QxqTe9zboU24rwxMppcmuKb+d0gupV9Ooga4w84BSJJ+1BfxKBNdppqRmVFl3WmFcnFJkHVHL1tUzUcWP6y4c+xJFEw5/tWqR9mvIvEFPdIzse3ORcTovjiZ2JGEpTEfjt00e5Ju371HK8kG03mW1OlY9bR9J/yu5H0cEAHBAl+fR/UN2N562/0Nx5s/m0fan97ON5jM/Y/h3iqvKR5nBZFU9LrxZTXieKq1IP6aHBeFxiXhYLK4/eO9hqPKFk91pR6a6RFR2E67LDN2f4cxkzzuf8bwmdT6vbqPt3DPLOg5N30XQDfviM1tSSZFExKN7UcIron/tjcN/1NHn9Jwz9siHL5U5m06Nt+RwZRl7CYcyqktw2iignnanDP4MJcWgSYMeOf9miQp4RzxdSMcjSvG0/HeKuoDe0vFGJZy/uGUdO70N0Lsznq7im8v3jNe7K1i+5eUs8wM0tUV093hNcn+8PVeXUxHxWfSWwItsR7lCTQ4L7657/XlCb+HkdLpuJ19h7d50KskvHNZz8DsLxp8XMJPHzvWp+XlZMyPnnmzaLaF6PnXtShy2GlAbOlbDbavzjLa1HelS0tKt8FziUA0p5/LNuXTDkMQXZMw49RoN/Y1REy69VVr7TbaGAocWUbL4Zln7CV1aCe8ekNDzdrZjncj7NthuyUNnbvqDhwR06etRRt9la8CddfDkQQkntoMdzR6UcGY72FEL26RXufN5LOq796bmziSkfjHJVORMwoX/GAvbwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHuEvHHwpwBwB0jYAAAAASUVORK5CYII=', // Optional fallback image
            
        },
    },
    families: [
        {
            family: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Family',
            },
            role: {
                type: String,
                enum: ['Admin', 'Editor', 'Viewer'],
                default: 'Viewer',
            },
        },
    ],
    bio : {
        type : String,
        maxlength : 200,
        default:"Haven’t written a bio yet, too busy living it."
    },
    isVerified : {
        type : Boolean,
        default : false,
    },

})

module.exports = mongoose.model('User', userSchema);
