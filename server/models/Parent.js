const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema,
  parentSchema = new Schema({
    username: String,
    password: String,
    email: String,
    parentView: {type: Boolean, default: true},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Child'}]
  })

  parentSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

  parentSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password)
  }

  parentSchema.pre('findOne', function(next) {
    this.populate('children')
    next()
  })

const Parent = mongoose.model('Parent', parentSchema)

module.exports = Parent
