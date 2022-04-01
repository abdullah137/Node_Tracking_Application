module.exports = {
    json: function(context) {
        return JSON.stringify(context);
    },
    ifEquals: function(arg1, arg2, options) {
        options.
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    checkList: function(arrayList=[], item) {
       if(arrayList.indexOf(item) >= 0 ) {
           return '<i class="fa fa-circle text-warning me-1"></i> Pending'
       }else {
           return 'It is not found'
       }
    }
}