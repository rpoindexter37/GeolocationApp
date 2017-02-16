const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema,
  tripStatusSchema = new Schema({
    long: Number,
    lat: Number,
  }, {timestamps: true}),
  tripSchema = new Schema({
    tripLength: Number,
    driverRating: Number,
    totalTime: Number,
    tripStatus: [tripStatusSchema]
  }),
    childSchema = new mongoose.Schema({
    name: {type: String},
    username: {type: String},
    password: {type: String},
    averageRating: {type: Number},
    averageTopSpeed: {type: Number},
    totalTripTime: {type: Number},
    parentView: {type: Boolean, default: false},
    trips: [tripSchema],
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Parent'}
  })



  childSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  }

  childSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password)
  }


  // passportLocalMongoose = require('passport-local-mongoose'),



  // tripStatusSchema = new Schema({
  //   long: Number,
  //   lat: Number,
  // }, {timestamps: true}),
  // tripSchema = new Schema({
  //   startLong: Number,
  //   startLat: Number,
  //   tripLength: Number,
  //   driverRating: Number,
  //   tripStatus: [tripStatusSchema]
  // }, {timestamps: true}),
  // childSchema = new Schema({
  //   username: String,
  //   password: String,
  //   averageRating: Number,
  //   averageTopSpeed: Number,
  //   totalTripTime: Number,
  //   parentView: false,
  //   trips: [tripSchema]
  // })






  childSchema.pre('findOne', function(next) {
    this.populate('parent')
    next()
  })




// userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('Child', childSchema)
