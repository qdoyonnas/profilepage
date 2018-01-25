var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	createdAt: {type: Date, default: Date.now},
	displayName: String,
	bio: String
});

var noop = function() {};

userSchema.pre("save", function(done) {
	var user = this;
	if( !user.isModified("password") ) {
		return done();
	}
	bcrypt.genSalt(SALT_FACTOR, function(error, salt) {
		if( error ) { return done(error); }
		
		//bcrypt.hash(user.password, salt, function(error, hashedPassword) {
		bcrypt.hash(user.password, salt, noop, function(error, hashedPassword) {
			if( error ) { return done(error); }
			
			user.password = hashedPassword;
			done();
		});
	});
});

userSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(error, isMatch) {
		done(error, isMatch);
	});
}

userSchema.methods.name = function() {
	//return ( this.displayName ? this.displayName : this.username );
	return this.displayName || this.username;
}

var User = mongoose.model("User", userSchema);

module.exports = User;