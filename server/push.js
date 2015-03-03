
var http = require('http');
function initHttp(path, push_json) {
        var host = 'localhost';
        var port = 8000;

        // prepare the header
        var postheaders = {
            'Content-Type' : 'application/json',
            'Content-Length' : push_json?Buffer.byteLength(push_json, 'utf8'):0
        };
        var headers = JSON.stringify(postheaders);
        console.log("headers " + headers);

        // the post options
        var optionspost = {
            host : host,
            port : port,
            path : path,
            method : push_json?'POST':'GET',
            headers : push_json?postheaders:''
        };
        return optionspost;
}

function sendPush(users, push_json) {
    console.log("sendPush to " + JSON.stringify(users));
}


module.exports = {
    sendPushToAll: function(push_json) {
        var optionspost = initHttp('/send', push_json);
        var httpRequest = http.request(optionspost, function(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        httpRequest.write(push_json);
        httpRequest.end();
        httpRequest.on('error', function(err) {
            console.err("http post error " + JSON.stringify("err"));
        });
    },

    sendPushToUsers: function(users, push_json) {

    },

    sendPushExceptMe: function(me, push_json) {
        console.log("sendPushExceptMe " + me + " push_json " + push_json);
        var optionspost = initHttp('/users', null);
        var httpRequest = http.request(optionspost, function(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                var users = JSON.parse(chunk);
                var send_to = [];
                for (var i = 0; i < users.users.length; i++) {
                    console.log("index " + i + " element " + users.users[i]);
                    if (me && users.users[i] === me.toString()) {
                        console.log("found me, don't send to myself " + me);
                    } else {
                        send_to.push(users.users[i]);
                    }
                }
                if (send_to.length > 0) {
                    sendPush(send_to, push_json);
                } else {
                    console.log("there is no available token for sending");
                }
            });
        });

        httpRequest.end();
        httpRequest.on('error', function(err) {
            console.error("http post error " + JSON.stringify("err"));
        });

    },

    getPushUsers: function() {
        var optionspost = initHttp('/users', null);
        var httpRequest = http.request(optionspost, function(response) {
            console.log('STATUS: ' + response.statusCode);
            console.log('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });

        httpRequest.end();
        httpRequest.on('error', function(err) {
            console.error("http post error " + JSON.stringify("err"));
        });
    }
    

};
