var paper = require('./lib/paper.js/node.js');
var express = require('express');
var sender = require('./sender');
var storage = require('./storage');

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path');
 

function getAllPaths(callback) {
    var path = paper.project.activeLayer.firstChild;
    while (path) {
        var segments = [];
        for (var segmentIndex = 0, l = path.segments.length; segmentIndex < l; ++segmentIndex) {
            var segment = path.segments[segmentIndex];
            segments.push({
                x: segment.point.x, 
                y: segment.point.y,
                ix: segment.handleIn.x,
                iy: segment.handleIn.y,
                ox: segment.handleOut.x,
                oy: segment.handleOut.y,
            });
        }
        var message = {
            id: path.name, 
        };
        if (segments.length > 0) {
            message.segments = segments;
        }
        message.closed = path.closed;
        callback(message);
        path = path.nextSibling;
    }
}

function publishPathsToClient(socket) {
    storage.importPath(function(message){
      socket.emit('add path', message);
    });
    getAllPaths(function(message){      
      socket.emit('add path', message);
    });
}

server.listen(8001);

app.configure(function(){   
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
   res.render('index'); 
});

paper.setup();

io.sockets.on('connection', function(socket) {
    publishPathsToClient(socket);
    sender.setup(paper, socket);
    socket.on('store path',function(){
      var pathIds = [];
      getAllPaths(function(message){
        pathIds.push(message.id);
        storage.storeMessage(message);
      });
      socket.emit('remove path', {id: pathIds});
    });

});
