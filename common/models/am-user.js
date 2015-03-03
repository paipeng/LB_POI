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
    AmUser.afterRemote('login', function(ctx, affectedModelInstance, next) {
        console.log("AmUser after Remote login " + JSON.stringify(ctx.result));
        console.log("token: " + JSON.stringify(ctx.req.body));
        console.log("model : " + JSON.stringify(affectedModelInstance));
        next();
    });
    AmUser.beforeRemote('login', function(ctx, affectedModelInstance, next) {
        console.log("AmUser before Remote login " + JSON.stringify(ctx.result));
        //var util = require('util');
        //console.log("token: " + util.inspect(ctx.req));
        console.log("model : " + JSON.stringify(affectedModelInstance));
        next();
    });
};
