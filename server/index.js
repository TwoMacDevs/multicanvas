const server = require('http').createServer(function(req,res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }

  if(req.method === "GET") {
    console.log("GET!");
  }
});
const io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let grid = new Array(2500).fill(0);

io.on('connection', client => {
  console.log("someone connected!")
  client.emit("draw", grid);

  client.on("draw", data => 
  {
    grid = data
    client.broadcast.emit("draw", grid);
    
  }
)});
server.listen(5000,'0.0.0.0', () => console.log('server is running!'));