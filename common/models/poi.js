module.exports = function(Poi) {
    // model hooks
    Poi.beforeCreate = function(next, modelInstance) {
        console.log("Poi beforeCreate");
        modelInstance.created = Date.now();
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
