var
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema,
  parentSchema = new Schema({
    username: { type: String, required: true, index: { unique: true}},
    password: {type: String, required: true, select: false},
    name: String,
    email: {type: String},
    parentView: {type: Boolean, default: true},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Child'}]
  })

  // hash the password before the user is saved
parentSchema.pre('save', function(next) {
	var user = this;

	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
parentSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

  parentSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }

  // parentSchema.methods.validPassword = function(password){
  //   return bcrypt.compareSync(password, this.local.password)
  // }

  parentSchema.pre('findOne', function(next) {
    this.populate('children')
    next()
  })

const Parent = mongoose.model('Parent', parentSchema)

module.exports = Parent
