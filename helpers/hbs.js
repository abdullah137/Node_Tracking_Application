module.exports = {
    json: function(context) {
        return JSON.stringify(context);
    },
    ifequals: function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
}