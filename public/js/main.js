require.config({
    baseUrl: "/js/lib",

    paths: {
        jquery: 'jq',
        socketio: 'http://roteroktober.de:8001/socket.io/socket.io',
        paper: 'paper',
        app: '../app'
    },

    shim: {
        jquery: {
            exports: '$'
        },
        socketio: {
            exports: 'io'
        },
        paper: {
            exports: 'paper'
        },

    }
});


require(["jquery", "socketio","paper","app/paper","app/socket","app/ui","app/receiver","app/tools"], function($,io,p,paper,socket,ui,receiver) {
	socket.on('connect', function() {
   		receiver.setupReceiver(false);
	});
});
