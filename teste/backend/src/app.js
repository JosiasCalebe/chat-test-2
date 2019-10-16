// configurações
const express = require('express')
const app = express()
const socketio = require('socket.io');
const http = require('http');
// mongodb
var mongoose = require("mongoose");

//Rotas
const index = require('./routes/index')
const itensRoute = require('./routes/itensRoute')
const usuariosRoute = require('./routes/usuariosRoute')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');


const server = http.createServer(app);
const io = socketio(server);

// cors
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

// mongodb 
mongoose.connect('mongodb://127.0.0.1:27017/contapragente', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// mongoose.connect('mongodb://admin:admin132@ds329058.mlab.com:29058/contapragente', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// verificar se foi conectado mesmo
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("conexão feita com sucesso.");
});

app.use(express.json());
app.use('/', index)
app.use('/api/usuarios', usuariosRoute)
app.use('/api/itens', itensRoute)

io.on('connect', (socket) => {

  socket.on('join', ({ name, room },callback) => {
      const { error, user } = addUser({ id: socket.id, name, room});
      
      if(error) return callback(error);

      socket.emit('message', { user: 'admin', text: `${user.name}, bem vindo a sala ${user.room}!` });
      socket.broadcast.to(user.room).emit('message', { user:'admin', text: `${user.name}, entrou!` });

      socket.join(user.room);

      io.to(user.room).emit('roomData', {room: user.room, users: getUsersInRoom(user.room)});

      callback();
  });

  socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id);
      if(user){
          io.to(user.room).emit('message', { user: user.name, text: message });
      }
      callback();
  });

  socket.on('disconnect', () =>{
      const user = removeUser(socket.id);
      if(user){
          io.to(user.room).emit('message', { user: 'admin', text: `${user.name} saiu.`});
          io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
      }
  });
});
 
const port = 5000;

server.listen(port, function() {
	console.log(`app listening on port ${port}`)
})