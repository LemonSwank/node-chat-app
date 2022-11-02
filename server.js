var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model('Message', {
        name : String,
        message: String
})

var dbUrl = 'mongodb+srv://outis:2Y2eO37poW4YkDYi@cluster0.amldusa.mongodb.net/simple-chat'

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages)=> {
        res.send(messages);
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({name: user},(err, messages)=> {
      res.send(messages);
    })
})

app.post('/messages', async (req, res) => {
    var message = new Message(req.body);
    try{
        var savedMessage = await message.save()
        console.log('saved');
        io.emit('message', req.body);
        res.sendStatus(200);
    }
    catch (error){
        res.sendStatus(500)
        console.log('error: '. error)
    }
    finally {
        console.log('Message Posted')
    }
})

io.on('connection', () =>{
    console.log('a user is connected')
})
   
mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected, Error:', err);
})

var server = app.listen(6666, ()=> {
    console.log('server is running on port', server.address().port)
});