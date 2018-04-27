var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

schema.methods.encryptPassword = (pass) => {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(5), null);
};

schema.methods.validPassword = function(pass) {
    return bcrypt.compareSync(pass, this.password);
};

module.exports = mongoose.model("User", schema);