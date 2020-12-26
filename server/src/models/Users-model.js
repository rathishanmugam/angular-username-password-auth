const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 15,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email format")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// usersSchema.pre('save', function (next) {
//     const user = this
//
//     if (user.isModified('password')) {
//         bcrypt.genSalt(10, function (err, salt) {
//             if (err) {
//                 return next(err);
//             }
//             bcrypt.hash(user.password, salt, null, function (err, hash) {
//                 if (err) {
//                     return next(err);
//                 }
//                 user.password = hash;
//                 next();
//             });
//         });
//         // user.password = await bcrypt.hash(user.password, 8)
//     }
//
//     // next()
// })


usersSchema.methods.findByCredentials = (email, password) => {
    // const user = await Users.findOne({ email })
    //
    // if (!user) {
    //     throw new Error('Unable to login')
    // }
    Users.findOne({email}).exec().then(user => {
        if (!user) {
            throw new Error('Unable to login')
        }
    })
    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
            return console.log(err);
        }
        if (!isMatch) {
            throw new Error('Unable to login')
        }
        return user
    });

    // const isMatch = await bcrypt.compare(password, user.password)
    //
    // if (!isMatch) {
    //     throw new Error('Unable to login')
    // }
    //
    // return user
}

usersSchema.methods.generateAuthToken = function () {
    const secret = {'key': 'mernsecure'}
    process.env.JWT_SECRET = secret.key;
    const user = this

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    user.save(error => {
        if (error) res.status(500).send(error);
        return token
    })
    // await user.save()
    //
    // return token
}

usersSchema.methods.toJSON = function () {
    const user = this
    const publicUserData = user.toObject()

    delete publicUserData.password
    delete publicUserData.tokens

    return publicUserData
}

const Users = mongoose.model('Users', usersSchema)

module.exports = Users

