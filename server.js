// ########################CONFIG########################

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

app.use(bodyParser.json());
app.use(express.static( __dirname + '/blackBeltApp/dist' ));

// ########################################################


// ########################MONGOOSE########################

mongoose.connect('mongodb://localhost/black_belt');
mongoose.set('debug', true)
let Schema = mongoose.Schema;

let petSchema = new mongoose.Schema({
    name: {required: true, type: String, unique: [true, "Pet already exists!"], uniqueCaseInsensitive: true, minlength: [3, "Pet name length needs to be greater than 3 characters!"]},
    type: {required: true, type: String, minlength: [3, "Pet Type needs to be greater than 3 characters!"]},
    desc: {required: true, type: String, minlength: [3, "Pet Desc needs to be greater than 3 characters!"]},
    skill1: {required: false, type: String, minlength: [3, "Skill needs to be greater than 3 characters!"]},
    skill2: {required: false, type: String, minlength: [3, "Skill needs to be greater than 3 characters!"]},
    skill3: {required: false, type: String, minlength: [3, "Skill needs to be greater than 3 characters!"]},
    likes: {type: Number}

}, {timestamps: true});

petSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.'});

mongoose.model('pet', petSchema);
var Pet = mongoose.model('pet');

// ########################################################

// ########################Routes########################
// // Root Request

// //get all pets
app.get('/show-all', function(req, res) {
    Pet.find({}, function(err, data) {
        if (err) {
          console.log('got an error');
        res.json({error: err});
        }
        else {
        console.log('showing all pets');
        res.json({message: "success", pets: data});
      }
    }).sort([['type', -1]]).exec()
})

// app.get('/all-dishes', function(req, res) {
//     Dish.find({}, function(err, data) {
//         if (err) {
//           console.log('got an error');
//         res.json({error: err});
//         }
//         else {
//         console.log('showing all dishes');
//         res.json({message: "success", dishes: data});
//       }
//   })
// })

//new pet
app.post('/new', function(req, res) {
  var newPet = new Pet({
    name: req.body.name,
    type: req.body.type,
    desc: req.body.desc,
    skill1: req.body.skill1,
    skill2: req.body.skill2,
    skill3: req.body.skill3,
    likes: 0
  }) //".body" is the entire object you sent in from the service
   console.log("IN THE SERVER: ", req.body.name)
  newPet.save(function(err, results) {
    if (err) {
      res.send(500, { errors:newPet.errors });
    } else {
      console.log('successfully added a pet');
      res.json({success: results});
      }
  })
})

// delete pet
app.delete('/delete/:id', function(req, res) {
  console.log("server deleting: ", req.params.id)
   Pet.findByIdAndRemove(req.params.id, function(err, results) {
     if(err) {
       res.json({error: err})
     } else {
       console.log('successfully deleted');
       res.json({success:results})
     }
   })
})
// show one pet
app.get('/pets/:id', function(req, res){
  console.log("id:", req.params.id)
    Pet.findById(req.params.id, function(err, data){
        if (err) {
            console.log(err);
            res.json({error: err});
        } else {
            res.json(data);
        }
    });
});
//
// //ADD QUOTE to this author - votes start at 0
// app.post('/authors/:id/dishes', function(req, res) {
//     var quote = {text: req.body.text, votes: 0}
//     Country.update({_id: req.params.id}, { $push: { dishes: quote}}, function(err, results) {
//         if (err) {
//             console.log(err);
//             res.json({error: err});
//         } else {
//             res.json({success: results});
//         }
//     });
// });
//
//update pet
app.put('/updatepet/:id', function(req, res) {
  var pet = {name: "", type: "", desc: "", skill1: "", skill2: "", skill3: ""};
  pet.name = req.body.name;
  pet.type = req.body.type;
  pet.desc = req.body.desc;
  pet.skill1 = req.body.skill1;
  pet.skill2 = req.body.skill2;
  pet.skill3 = req.body.skill3;
    Pet.findOneAndUpdate({_id: req.params.id}, pet, { runValidators: true, context: 'query'}, function(err, data) {
      if (err) {
        res.json({error: err});
        console.log("error updating pet", err);
      } else {
        res.json({success: data});
    }
  })
})

// //add dish
// app.post('/newdish/:id', function (req, res){
//   Country.findById({_id: req.params.id}, function(err, country){
//          var dish = new Dish({
//            name: req.body.name,
//            desc: req.body.desc,
//            imageUrl: req.body.imageUrl,
//            votes: 0
//             }
//          );
//          dish._country = country._id;
//          country.dishes.push(dish);
//          dish.save(function(err){
//                  country.save(function(err){
//                        if(err) { console.log('Error'); }
//                        else { res.json({success: country}); }
//                  });
//          });
//    });
// });

// // GET DISHES FOR THE COUNTRY
// app.get('/dishes/:id', function (req, res){
// // the populate method is what grabs all of the comments using their IDs stored in the
// // comment property array of the post document!
//  Country.findOne({_id: req.params.id})
//  .populate('dishes') //THIS IS CASE SENSITIVE
//  .sort({votes: -1})
//  .exec(function(err, dishes) {
//    console.log("dishes:", dishes);
//       res.json({success: dishes});
//     })
// });



// UPDATE Likes
app.put('/pets/:id/like', function(req, res) { // capture the ID
  console.log("in the server", req.body)
  let pet = req.body //getting the whole object again
      Pet.findOneAndUpdate({_id: req.params.id}, pet, function(err, data) {
        if (err) { //find the ID from the req.params and pass in the object. Save it!
          res.json({error: err});
          console.log("error updating likes", err);
        } else {
          res.json({success: data});
      }
    })
  })


// delete pet
app.delete('/delete/:id', function(req, res) {
  console.log("server deleting: ", req.params.id)
   Pet.findByIdAndRemove(req.params.id, function(err, results) {
     if(err) {
       res.json({error: err})
     } else {
       console.log('successfully deleted');
       res.json({success:results})
     }
   })
})


app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./blackBeltApp/dist/index.html"))
  });

//########################Start Server########################
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("Black Belt listening on port 8000");
})
