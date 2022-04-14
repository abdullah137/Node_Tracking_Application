module.exports = {
    json: function(context) {
        return JSON.stringify(context);
    },
    ifEquals: function(arg1, arg2, options) {
        options.
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    },
    
    statusList: function(awaitList=[], acceptList=[], declineList=[], userId) {
        
       if(awaitList.indexOf(userId) >= 0 ) {
           return '<i class="fa fa-circle text-warning me-1"></i> Pending'
       }else if(acceptList.indexOf(userId) >= 0) {
           return '<i class="fa fa-circle text-success me-1"></i> Accepted'
       }else if(declineList.indexOf(userId) >= 0) {
           return '<i class="fa fa-circle text-success me-1"></i> Decline'
       }else {
           return ''
       }
    },

    statusIcon: function(awaitList = [], acceptList=[], declineList=[], userId, id ) {

        if(awaitList.indexOf(userId) >= 0 ) {
            return `
            <a href="friend-decline/${id}" class="btn btn-danger shadow btn-xs sharp me-1"><i class="fas fa-times"></i></a>
            <a href="friend-accept/${id}" class="btn btn-success shadow btn-xs sharp me-1"><i class="fas fa-check"></i></a>
            `
        }else if(acceptList.indexOf(userId) >= 0) {
            return `<a href="friend-remove/${id}" class="btn btn-warning shadow btn-xs sharp me-1"><i class="fas fa-trash"></i></a>`
        }else if(declineList.indexOf(userId) >= 0) {
            return `<a href="friend-request/${id}" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-user"></i></a>`
        }else {
            return `<a href="friend-request/${id}" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fas fa-user"></i></a>`
        }

    },

    // Helpers for profile image
    profile: function( userImage ) {
        if(userImage === "" || userImage === undefined) {
            return `../admin/images/avatar-2.PNG`
        }else {
            return  `../uploads/${userImage}`;
        }
    }
}