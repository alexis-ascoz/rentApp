const { app } = require('./app')
const { connectAndSync } = require('./model/model')

// Init BDD
connectAndSync()

// Run app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
