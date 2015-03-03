module.exports = function(Poi) {
    // model hooks
    Poi.beforeCreate = function(next, modelInstance) {
        console.log("Poi beforeCreate");
        console.log("token: " + modelInstance.token);
        modelInstance.created = Date.now();
        next();
    };

    Poi.afterCreate = function(next) {
        console.log("Poi afterCreate");
        console.log("token: " + this.token);
        var pushServer = require('../../server/push');
        //pushServer.getPushUsers();

        var push = {};
        //push.users = {};
        push.android = {};
        push.android.collapseKey = "optional";
        push.android.data = {};
        push.android.data.message = "New POI " + this.name;
        push.android.data.sound= "alert.mp3";
        push.android.data.push = this;

        push.ios = {};
        push.ios.badge = 0;
        push.ios.alert = push.android.data.message;
        push.ios.sound = push.android.data.sound;
        push.ios.payload = {};
        push.ios.payload.push = push.android.data.push;


        var push_json = JSON.stringify(push);
        //console.log(" push_json " + push_json);
        //pushServer.sendPushToAll(push_json);
        pushServer.sendPushExceptMe(this.token, push_json);
        next();
    };

    // remote methods
    Poi.echo = function(msg, cb) {
        cb(null, 'Echo ' + msg);
    };

    Poi.remoteMethod(
        'echo',
        {
            accepts: { arg: 'msg', type: 'string'},
            returns: { arg: 'echo', type: 'string'}
        }
    );
    
};
