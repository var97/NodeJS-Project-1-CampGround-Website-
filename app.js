var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose")
    
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {name: "Granite Hill", 
//     image: "https://cdn.pixabay.com/photo/2015/09/01/16/07/brown-bear-917169_960_720.jpg",
//     description: "This is a huge granite hill, no bathrooms , no water. Beautiful granite"    
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("New Campground");
//             console.log(campground);
//         }
//     });

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res){
    //get all campground for db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
        res.render("index", {campgrounds:allCampgrounds}); 
        }
    }); 
        //res.render("campgrounds", {campgrounds:campgrounds}); 
});

//CREATE - ADD NEW CAMPGROUND TO DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name, image:image, description:desc}
   //create a new campground and save it in database
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       }
       else{
           res.redirect("/campgrounds");
       }
   });
   //redirect back to campgrounds page
   });

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND 
app.get("/campgrounds/new", function(req, res) {
    res.render("new.ejs");
});

//SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {campground: foundCampground});
        }
    });
    //render show template with that campground
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started");
});