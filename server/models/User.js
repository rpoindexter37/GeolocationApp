const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  // passportLocalMongoose = require('passport-local-mongoose'),
  tripStatusSchema = new Schema({
    long: Number,
    lat: Number,
  }, {timestamps: true}),
  tripSchema = new Schema({
    startLong: Number,
    startLat: Number,
    tripLength: Number,
    driverRating: Number,
    tripStatus: [tripStatusSchema]
  }, {timestamps: true}),
  childSchema = new Schema({
    username: String,
    password: String,
    averageRating: Number,
    averageTopSpeed: Number,
    totalTripTime: Number,
    parentView: false,
    trips: [tripSchema]
  }),

  parentSchema = new Schema({
    username: String,
    password: String,
    email: String,
    parentView: true
  })


  var parentSchema = new mongoose.Schema({
    name: {type: String},
    password: {type: String},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Child'}]
  })

  parentSchema.pre('findOne', function(next) {
    this.populate('children')
    next()
  })

  var Parent = mongoose.model('Parent', parentSchema)

  var childSchema = new mongoose.Schema({
    name: {type: String},
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Parent'}
  })

  childSchema.pre('findOne', function(next) {
    this.populate('parent')
    next()
  })

  var Child = mongoose.model('Child', childSchema)



// userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('parent', parentSchema)
module.exports = mongoose.model('child', parentSchema)
