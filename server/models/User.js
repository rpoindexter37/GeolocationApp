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
    trips: [tripSchema]
  }),

  parentSchema = new Schema({
    username: String,
    password: String,
    email: String,
  })


// userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('parent', parentSchema)
module.exports = mongoose.model('child', parentSchema)
