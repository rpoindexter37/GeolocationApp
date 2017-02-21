const
  mongoose = require('mongoose'),
  // passportLocalMongoose = require('passport-local-mongoose'),
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


var Child = mongoose.model('Child', childSchema)

// Child.findById('58a50ffcbf06e430fd124638', (err, child) => {
//   if(err) return console.log(err)
//   var trip = child.trips.id('58a50ffcbf06e430fd124639')
//   trip.tripStatus.push({lat: 666, long: 69})
//   child.save((err, updatedChild) => {
//     console.log(updatedChild)
//   })
// })

module.exports = Child
