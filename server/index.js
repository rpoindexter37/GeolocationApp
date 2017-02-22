var
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  flash = require('connect-flash'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  // MongoDBStore = require('connect-mongodb-session')(session),
  passport = require('passport'),
  dotenv = require('dotenv').load({silent: true}),
  bodyParser = require('body-parser'),
  Parent = require('./models/Parent.js'),
  Child = require('./models/Child.js'),
  PORT = process.env.PORT || 3000,
  jwt = require('jsonwebtoken'),
  apiRouter = express.Router(),
  superSecret = 'thisisasecretforjwt'
  mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/locations-app'

// const store = new MongoDBStore({
//   uri: mongoConnectionString,
//   collection: 'sessions'
// })


//middleware
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  // app.use(cookieParser())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(express.static(process.env.PWD + '/www'))
  app.use(flash())
  // app.use(session({
  // secret: 'boooooooooom',
  // cookie: {maxAge: 60000000},
  // resave: true,
  // saveUninitialized: false,
  // store: store
  // }))
  // app.use(passport.initialize())
  // app.use(passport.session())





// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//mongoose connection
  mongoose.connect(mongoConnectionString, (err) => {
  console.log(err || "Connected to MongoDB.")
})



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

  app.patch('/parent/:id', (req, res) => {
    Parent.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, parent) {
      if (err) throw err
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

      app.delete('/child/:childId/:tripId', function(req, res){
        var cId = req.params.childId
        var tId = req.params.tripId
        console.log(cId)
        Child.findById(cId, function(err, child) {
          if (err) return console.log(err)
          var trips = child.trips
          var tripIndex = trips.indexOf(tId)
          trips.splice(tripIndex, 1)
          console.log("trip was removed")
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


    apiRouter.post('/authenticate', function(req, res) {
      // find the user
      Parent.findOne({
        username: req.body.username})
        .select('name username password')
        .exec(function(err, parent) {
        if (err) throw err;
        // no user with that username was found
        if (!parent) {
          res.json({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        }
        else if (parent) {

          // check if password matches
          var validPassword = parent.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          }
          else {

            // if user is found and password is right
            // create a token
            var token = jwt.sign({
            	name: parent.name,
            	username: parent.username
            },
            superSecret, {
            expiresIn: '24h' // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }
        }
      });
    });

app.listen(PORT, (err) => {
  console.log(err || "server running on port " + PORT)
})
