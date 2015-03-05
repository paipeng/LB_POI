module.exports = function(Poi) {
    // model hooks
/*
    Poi.beforeCreate = function(next, modelInstance) {
        console.log("Poi beforeCreate");
        console.log("token: " + modelInstance.token);
        modelInstance.created = Date.now();
        next();
    };
*/
Poi.observe('before save', function updateTimestamp(ctx, next) {
  console.log("Poi before save observe");
  if (ctx.instance) {
        console.log("token: " + ctx.instance.token);
        ctx.instance.created = Date.now();
  } else {
        console.log("data token: " + ctx.data.token);
        ctx.data.created = Date.now();
  }
  next();
});

    //Poi.afterCreate = function(next) {
    Poi.observe('after save', function updateTimestamp(ctx, next) {
        console.log("Poi after save");
        if (ctx.instance) {
            console.log("saved " + JSON.stringify(ctx.Model));
            console.log("token: " + ctx.instance.token);
        } else {
            console.log('Updated %s matching %j',
                ctx.Model.pluralModelName,
                ctx.where);
        }
        var pushServer = require('../../server/push');

        var push = {};
        //push.users = {};
        push.android = {};
        push.android.collapseKey = "optional";
        push.android.data = {};
        push.android.data.message = "New POI " + this.name;
        push.android.data.sound= "alert.mp3";
        push.android.data.push = ctx.instance;

        push.ios = {};
        push.ios.badge = 0;
        push.ios.alert = push.android.data.message;
        push.ios.sound = push.android.data.sound;
        push.ios.payload = {};
        push.ios.payload.push = push.android.data.push;


        //pushServer.sendPushToAll(push_json);
        pushServer.sendPushExceptMe(ctx.instance.token, push);
        next();
    });

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
