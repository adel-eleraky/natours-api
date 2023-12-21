const fs = require("fs")
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const Tour = require("./../../models/tourModel")
const mongoose = require('mongoose');

// connect to mongo atlas
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB , {
    useNewUrlParser: true,
}).then((conn) => {
    console.group('DB connected successfully');
});

const tours = JSON.parse( fs.readFileSync(`${__dirname}/tours-simple.json` , "utf-8" ));

const importData = async() => {
    try{

        await Tour.create(tours)

        console.log("data imported successfully")
    }catch(err) {
        console.log(err)
    }
}

const deleteData = async() => {
    try {

        await Tour.deleteMany();

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