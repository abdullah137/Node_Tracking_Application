const moment = require('moment');
module.exports = { 
    logins: function(date, format){
        return moment(date).date(format);
    }
}