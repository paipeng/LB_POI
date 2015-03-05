module.exports = function(Container) {
Container.observe('before save', function(ctx, next) {
  console.log("Container before save observe");
  /*
  if (ctx.instance) {
        console.log("token: " + ctx.instance.token);
        ctx.instance.created = Date.now();
  } else {
        console.log("data token: " + ctx.data.token);
        ctx.data.created = Date.now();
  }
  */
  next();
});

};
