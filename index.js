//multiple user can connect
//prereserved event of socketio-connection,disconnect,message,reconnect,ping,join,leave
//client side-connect,disconnect,connect_error,connect_timeout,reconnect
//emit for custom event
//namespace-multiple connection
//var customnamespace(another io)=io.of('/....),by default / is used

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const socketIo = require('socket.io');
const publicDir = path.join(__dirname);
const io = socketIo(http); 
app.use(express.static(publicDir));

app.get("/", (req, res) => {
    res.sendFile('index.html', { root: publicDir });
});
var user=0;
var room=1;
var full=0;
io.on('connection',(socket)=>
{
    console.log("a user connected")
    user++
    socket.emit('newuser',{message:"new user"})
    //ye sabko jayga
    io.sockets.emit('broadcast',{message:user + "is connected"})
    //connected user chor ke sabko
    socket.broadcast.emit("newuser",{message:user})
    socket.on('disconnect',()=>{
        console.log("a user disconnected")
        user--
    })
    setTimeout(() => {
        //socket.send('sent message from server side by prereserved events')
        socket.emit('my-custom-event',({name:"priyam",fname:"priyamkarn"}))
    }, 3000);
    socket.on('clientside',(data)=>
    {
        console.log(data);
    })
    //room logic
    socket.join(room);
    io.socket.in(room).emit('connectedroom',"you are connected to room no. "+room)
    full++;
    if(full>2)
    {
        full=0;
        room++;
    }
})
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


