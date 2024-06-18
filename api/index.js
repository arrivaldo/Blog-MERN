const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require ('cookie-parser');


const salt = bcrypt.genSaltSync(10)
const secret = 'asdasfgasdasadsfsam'



app.use(cors({credentials: true, origin: "http://localhost:3001"}));
app.use(express.json());
app.use(cookieParser());


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

            jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json({
                    id: userDoc.id,
                    username,
                });
            })
            // res.json({ message: 'Login successful' });

        }
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    })


});


app.post('/logout', (re,res) => {
    res.cookie('token', '').json('ok')
})

app.listen(4000);


//mongodb+srv://blog:UlhmwvInlm62F5tt@cluster0.9irkhhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//UlhmwvInlm62F5tt