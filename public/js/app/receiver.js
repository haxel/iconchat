define(['paper','app/socket'],function (paper,socket) {
    return {
        setupReceiver : function(isnode) {
            socket.on('add path', function(message) {
               
                var path;
                if (typeof message.segments !== 'undefined' && message.segments.length > 0) {
                    var segments = [];
                    for (var i = 0, l = message.segments.length; i < l; ++i) {
                        var segment = message.segments[i];
                        segments.push(new paper.Segment(
                            new paper.Point(segment.x, segment.y),
                            new paper.Point(segment.ix, segment.iy),
                            new paper.Point(segment.ox, segment.oy)));                
                    }
                    path = new paper.Path(segments);
                    path.closed = message.closed;
                }
                else path = new paper.Path();
                path.name = message.id;
                path.strokeColor = 'black';
                if (isnode) socket.broadcast.emit('add path', message);
                else paper.view.draw();
            });
            socket.on('add path point', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var path = paper.project.activeLayer.children[message.id];
                if (typeof path !== 'undefined') {
                    path.add(new paper.Point(message.x, message.y));
                    if (isnode) socket.broadcast.emit('add path point', message);
                    else paper.view.draw();
                }
            });
            socket.on('end path', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var path = paper.project.activeLayer.children[message.id];
                if (typeof path !== 'undefined') {
                    path.simplify();
                    if (isnode) socket.broadcast.emit('end path', message);
                    else paper.view.draw();
                }
            });
            socket.on('remove path', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var ids = message.id;
                if (Object.prototype.toString.call(message.id) !== "[object Array]") {
                    ids = [message.id];
                }
                for (var i = 0, l = ids.length; i < l; ++i) {
                    var path = paper.project.activeLayer.children[ids[i]];
                    if (typeof path !== 'undefined') {
                        path.remove();
                    }
                }
                if (isnode) socket.broadcast.emit('remove path', message);
                else paper.view.draw();
            });
            socket.on('move path', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var ids = message.id;
                if (Object.prototype.toString.call(message.id) !== "[object Array]") {
                    ids = [message.id];
                }
                for (var i = 0, l = ids.length; i < l; ++i) {
                    var path = paper.project.activeLayer.children[ids[i]];
                    if (typeof path !== 'undefined') {
                        path.position.x += message.delta.x;
                        path.position.y += message.delta.y;
                    }
                }
                if (isnode) socket.broadcast.emit('move path', message);
                else paper.view.draw();
            });
            socket.on('move segment', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var path = paper.project.activeLayer.children[message.id];
                if (typeof path !== 'undefined') {
                    var pt = path.segments[message.segment].point;
                    pt.x += message.delta.x;
                    pt.y += message.delta.y;
                    path.smooth();
                    if (isnode) socket.broadcast.emit('move segment', message);
                    else paper.view.draw();
                }
            });
            socket.on('fit path', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var path = paper.project.activeLayer.children[message.id];
                if (typeof path !== 'undefined') {
                    path.fitBounds(message.rect);
                    path.rotate(message.angle);
                    if (isnode) socket.broadcast.emit('fit path', message);
                    else paper.view.draw();
                }
            });
            socket.on('rotate path', function(message) {
                if (typeof message == 'undefined' || typeof message.id == 'undefined') return;
                var ids = message.id;
                if (Object.prototype.toString.call(message.id) !== "[object Array]") {
                    ids = [message.id];
                }
                for (var i = 0, l = ids.length; i < l; ++i) {
                    var path = paper.project.activeLayer.children[ids[i]];
                    if (typeof path !== 'undefined') {
                        path.rotate(message.angle, new paper.Point(message.center[0], message.center[1]));
                    }
                }
                if (isnode) socket.broadcast.emit('rotate path', message);
                else paper.view.draw();
            });
        }
    }
})