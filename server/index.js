const
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  Parent = require('./models/Parent.js')
  Child = require('./models/Child.js')
  PORT = process.env.PORT || 3000,
  mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/locations-app'

//mongoose connection
  mongoose.connect(mongoConnectionString, (err) => {
  console.log(err || "Connected to MongoDB.")
})


const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
})

//middleware
  app.use(morgan('dev'))
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(express.static(process.env.PWD + '/www'))
  app.use(flash())


// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});



//model
  // var Trip = mongoose.model('Trip', {
  //   start: Date,
  //   locationInfo: {},
  //   end: Date,
  //   topMPH: Number,
  // })
  //
  // var parentSchema = new mongoose.Schema({
  //   name: {type: String},
  //   password: {type: String},
  //   children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Child'}]
  // })
  //
  // parentSchema.pre('findOne', function(next) {
  //   this.populate('children')
  //   next()
  // })
  //
  // var Parent = mongoose.model('Parent', parentSchema)
  //
  // var childSchema = new mongoose.Schema({
  //   name: {type: String},
  //   username: {type: String},
  //   password: {type: String},
  //   averageRating: {type: Number},
  //   averageTopSpeed: {type: Number},
  //   totalTripTime: {type: Number},
  //   parentView: {type: Boolean, default: false},
  //   parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent'}
  // })
  //
  // childSchema.pre('findOne', function(next) {
  //   this.populate('parent')
  //   next()
  // })
  //
  // var Child = mongoose.model('Child', childSchema)


//this sends the html file to the server
  app.get('/', (req, res) => {
    res.sendFile(process.env.PWD + '/www/index.html')
  })

  app.get('/trips', (req, res) => {
    Trip.find({}, function(err, trips) {
      res.json(trips)
    })
  })

  app.post('/trips', function(req, res) {
    Trip.create(req.body, function(err, trip) {
      res.send({message: "you done send me sumptin: ", trip: trip})
    })
  })

  app.post('/parent', function(req, res){
    Parent.create(req.body, function(err, parent){
      res.send({ message: "parent has been created", parent: parent})
    })
  })


  app.get('/parents', (req, res) => {
    Parent.find({}, function(err, parents) {
      res.json(parents)
    })
  })

  app.get('/parent/:id', (req, res) => {
    Parent.findById(req.params.id, function(err, parent){
      console.log('im trying to get one parent')
      res.sendFile(process.env.PWD + '/www/templates/user/parent.html')
        res.json(parent)
    })
  })


  app.get('/child', (req, res) => {
    Child.find({}, function (err, child) {
      res.json(child)
    })
  })

  app.get('/child/:id', (req, res) => {
    Child.findById(req.params.id, function(err, child) {
      res.json(child)
    })
  })


  app.post('/parent/:parentId', function(req, res){
    var pId = req.params.parentId
    Parent.findById(pId, function (err, thisParent) {
    var newChild = new Child(req.body)
    newChild.parent = req.params.id
    newChild.save((err, child) => {
      thisParent.children.push(child)
      thisParent.save()
      res.redirect('/child/' + child._id)
      })
    })
    })



    app.patch('/child/:childId', function(req, res){
      var cId = req.params.childId
      Child.findById(cId, (err, child) => {
        child.trips.push({})
        child.save()
        res.json(child.trips)
    })
  })

  app.delete('/child/:childId', function(req, res){
    var cId = req.params.childId
    console.log(cId)
    Child.findByIdAndRemove(cId, function(err) {
      if (err) return console.log(err)
      console.log("child was removed")
  })
})

    app.patch('/child/:childId/:tripId', function(req, res){
      console.log(req.body);
      var cId = req.params.childId
      var tId =req.params.tripId
      Child.findById(cId, (err, child) => {
          if(err) return console.log(err)
          var trip = child.trips.id(tId)
          trip.tripStatus.push(req.body)
          child.save((err, updatedChild) => {
            console.log(updatedChild)
            res.json(updatedChild)
          })
        })
      })

      // Child.findById('58a50ffcbf06e430fd124638', (err, child) => {
      //   if(err) return console.log(err)
      //   var trip = child.trips.id('58a50ffcbf06e430fd124639')
      //   trip.tripStatus.push({lat: 666, long: 69})
      //   child.save((err, updatedChild) => {
      //     console.log(updatedChild)
      //   })
      // })


      app.patch('/parent', function(req, res) {
        req.body.tripStatus
        res.json({message: "request received."})
      })



    app.post('/login', (req, res, next) => {
      passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(401).json({ err: info })
        req.logIn(user, (err) => {
          if (err) return res.status(500).json({ err: 'Could not log in user' })
          res.status(200).json({
            status: 'Login successful!',
            user: user
          })
        })
      })(req, res, next)
    })


app.listen(PORT, (err) => {
  console.log(err || "server running on port " + PORT)
})
