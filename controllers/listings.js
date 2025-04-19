const Listing = require("../models/listing")
const {listingSchema,reviewSchema} = require("../schema.js");

module.exports.index = async (req,res) =>{
      const allListings = await Listing.find({});
      res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) =>{
    console.log(req.user);
   res.render("listings/new.ejs");
}

module.exports.showListing =async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you are looking for deleted" );
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res)=>{
    // let{title,description,image,location, price, country } = req.body;
    //  let listing= req.body.listing;
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Please send valid data for listing");
    // }
    let result = listingSchema.validate(req.body);
    console.log(result);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success","New Listing Created!");
           // console.log(listing);
          res.redirect("/listings");
    };

    module.exports.renderEditForm = async (req,res) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you are looking for deleted" );
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs",{listing});
    };

    module.exports.updateListing = async (req,res) => {
        let {id} = req.params;
         await  Listing.findByIdAndUpdate(id,{...req.body.listing});
         req.flash("success"," Listing Updated!");
         res.redirect("/listings");
    };

    module.exports.destroyListing = async (req,res) =>{
        let {id} = req.params;
        let deletedlistings =  await Listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted!");
      console.log(deletedlistings);
      res.redirect("/listings");
    };