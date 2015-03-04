
module.exports = function(AmUser) {
    // model hooks
/*
    AmUser.beforeCreate = function(next, modelInstance) {
        console.log("Poi beforeCreate");
        console.log("token: " + modelInstance.token);
        modelInstance.created = modelInstance.lastUpdated= Date.now();
        next();
    };
*/

AmUser.observe('before save', function updateTimestamp(ctx, next) {
  console.log("AmUser before save observe");
  if (ctx.instance) {
        console.log("token: " + ctx.instance.token);
        ctx.instance.created = ctx.instance.lastUpdated= Date.now();
  } else {
        console.log("data token: " + ctx.data.token);
        ctx.data.created = ctx.data.lastUpdated= Date.now();
  }
  next();
});
AmUser.observe('access', function updateTimestamp(ctx, next) {
  console.log("AmUser observe access " + JSON.stringify(ctx));
  if (ctx.instance) {
        console.log("token: " + ctx.instance.token);
  } else {
        if (ctx.data) {
            console.log("data token: " + ctx.data.token);
        }
  }
  next();
});
    AmUser.afterRemote('login', function(ctx, amUser, next) {
        console.log("AmUser after Remote login " + JSON.stringify(ctx.result));
        console.log("token: " + JSON.stringify(ctx.req.body));
        console.log("model : " + JSON.stringify(amUser));
        //amUser.hasMany(pushtoken, {as: 'pushtokens', foreignKey: 'amUserId'});

        AmUser.getApp(function(err, app) {
            var models = app.models();
            models.forEach(function(Model) {
                console.log(Model.modelName);
                if (Model.modelName === 'pushtoken') {
                    var pushtoken = Model;
                    var token = {
                    token: ctx.req.body.token,
                    amUserId: amUser.userId}
                    console.log("token to add " + JSON.stringify(token));
                    pushtoken.create(token, function(err, model) {
                        console.log("create push token result " + err);
                        if (model) {
                            console.log("token result " + JSON.stringify(model));
                        }
                    });
                }
            });
        });
        next();
    });
    AmUser.beforeRemote('login', function(ctx, affectedModelInstance, next) {
        console.log("AmUser before Remote login " + JSON.stringify(ctx.result));
        //var util = require('util');
        //console.log("token: " + util.inspect(ctx.req));
        console.log("model : " + JSON.stringify(affectedModelInstance));
        next();
    });

    // remote methods
    AmUser.subscribePushToken = function(data, cb) {
        //var request = require('request');
        console.log("subscribePushToken " + JSON.stringify(data));
        var r = require('request-json');
        /*
        request.post('http://localhost:8000/', function(err, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
        });
        */
        var client = r.createClient('http://localhost:8000/subscribe');
        client.post('subscribe', data, function(err, res, body) {
                console.log("res " + JSON.stringify(res));
                console.log("body " + JSON.stringify(body));
            if (res.statusCode == 200) {
                cb(null, body);
            } else {
                console.log("err " + err);
                var err = new Error();
                err.status = 400;
                err.message = body;
                cb(err);
            } 
        }); 
        
    };
    AmUser.remoteMethod( 
        'subscribePushToken',
        {
            accepts: {arg: 'data', 
                      type: 'push', 
                      required: true, 
                      description: 'data format in json: { "user" : "aaa", "type" : "android", "token" : "aaa"}',
                       http: {source: 'body'}},
            returns: {arg: 'pushtoken', type: 'push', http: {source: 'body'}},
            errors: { code: 400, message: 'error'}
        }

    );
};
