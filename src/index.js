const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app =  express();
const router = express.Router();
const mongoUrl = 'mongodb+srv://Vinicius:v123456@cluster0.ii8xk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const user = require('./routes/User');

app.use(express.json());
app.use(cors());

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
    console.log('Aplicação conectada ao banco de dados');
});

app.use('/user', user);

app.use(router.get('/', (req, res) => {
    return res.send("ONLINE");
}));

app.set('PORT', process.env.PORT || 3333);

const server = app.listen(app.get('PORT'), () => {
    console.log(`Server running on port ${app.get('PORT')}`)
});
  
module.exports = {
    server,
    mongoose
}
