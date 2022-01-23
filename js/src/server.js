const { app } = require('./app')
const { sync } = require('./model/model')

// Sync DB
sync(false)

// Run app
app.listen(3000, function () {
    console.log('Express is running on port 3000');
});
