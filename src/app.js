const app = require('./config/express')
const {port} = require('./config/vars')
const mongoose = require('./config/mongoose')
const error = require('./api/middlewares/error')

mongoose.connect()
.catch((err) => {
    console.log(err)
})

app.listen(port, () => {
    console.log(`Listening to the port ${port}`);
})

app.use(error.handler)