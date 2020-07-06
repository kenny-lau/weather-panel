const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})