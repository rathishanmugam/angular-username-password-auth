const mongoose = require('mongoose')
process.env.MONGODB_URL = 'mongodb://database/user-data';
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

