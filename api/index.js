const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcrypt');

const app = express();

const salt = bcrypt.genSaltSync(10)




app.use(cors());
app.use(express.json())

mongoose.connect('mongodb+srv://blog:UlhmwvInlm62F5tt@cluster0.9irkhhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

app.post('/register', async (req, res) => {
    const {username,password} = req.body;
    try {

        const userDoc = await User.create({
            username, 
            password:bcrypt.hashSync(password, salt)
        })
        res.json(userDoc)
    } catch(e) {
        console.log(e)
          res.status(400).json(e)  
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(400).json({ message: 'User not found' });
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        if(passOk) {
            res.json({ message: 'Login successful' });

        }
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});



app.listen(4000);


//mongodb+srv://blog:UlhmwvInlm62F5tt@cluster0.9irkhhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//UlhmwvInlm62F5tt