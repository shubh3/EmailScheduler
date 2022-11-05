const app = require('./app');
const connectWithDb = require('./utils/db');
require('dotenv').config();




//connect with database
connectWithDb();
app.listen(process.env.PORT, ()=> {
    console.log('Server is running ' + process.env.PORT);
})


