const fs = require("fs")
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Tour = require("./../../models/tourModel")
const User = require("./../../models/userModel")
const Review = require("./../../models/reviewModel")
const mongoose = require('mongoose');

// connect to mongo atlas
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((conn) => {
    console.group('DB connected successfully');
});

const tours = JSON.parse( fs.readFileSync(`${__dirname}/tours.json` , "utf-8" ));
const users = JSON.parse( fs.readFileSync(`${__dirname}/users.json` , "utf-8" ));
const reviews = JSON.parse( fs.readFileSync(`${__dirname}/reviews.json` , "utf-8" ));

const importData = async() => {
    try{

        await Tour.create(tours)
        await User.create(users , { validateBeforeSave: false })
        await Review.create(reviews)

        console.log("data imported successfully")
    }catch(err) {
        console.log(err)
    }
}

const deleteData = async() => {
    try {

        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log("data deleted successfully")
    }catch(err) {
        console.log(err)
    }
}
console.log(process.argv)

if(process.argv[2] === '--import') {
    importData()
}else if(process.argv[2] === "--delete") {
    deleteData()
}