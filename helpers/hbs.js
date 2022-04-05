module.exports = {
    json: function(context) {
        return JSON.stringify(context);
    },
    ifEquals: function(arg1, arg2, options) {
        options.
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    checkList: function(awaitList=[], acceptList=[], declineList=[], userId) {
        
       if(awaitList.indexOf(userId) >= 0 ) {
           return '<i class="fa fa-circle text-warning me-1"></i> Pending'
       }else if(acceptList.indexOf(userId) >= 0) {
           return '<i class="fa fa-circle text-success me-1"></i> Accepted'
       }else if(declineList.indexOf(userId) >= 0) {
           return '<i class="fa fa-circle text-success me-1"></i> Decline'
       }else {
           return 'No action initiated'
       }
    }
}