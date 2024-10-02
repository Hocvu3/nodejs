const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require("./app");

const DB = process.env.DATABASE_LOCAL

mongoose.connect(DB,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con =>{
  //console.log(con.connection);
  //hi
  console.log('DB connection successful!');
})


// const testTour = new Tour({
//   name: "The Park Camper",
//   rating: 4.7,
//   price: 500
// })



// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('ERROR: ', err);
// })

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
}); 