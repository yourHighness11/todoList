require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');
const _ = require('lodash');

app.use(express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect(process.env.DATABASE_URL).then().catch(err => console.log(err));


//Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

const listSchema = {
  name: String,
  items: [itemsSchema]
}


//Model or collection
const Item = mongoose.model('Item', itemsSchema);

const Mylist = mongoose.model('Mylist', listSchema);

//Document
const item1 = new Item({
  name: 'Welcome to the todoList!'
});

const item2 = new Item({
  name: 'Hit + button to add items'
});

const item3 = new Item({
  name: 'Hit <-- to delete  an item'
});

const defaultItems = [item1, item2, item3];



Item.find({}, function(err, results) {
  if (err) {
    console.log(err);
  }
  // else {
  //     console.log(results);
  // }
});


// methods for '/'
app.get("/", function(req, res) {

  let day = date.getMyDate();
  //finding items on port
  Item.find({}, function(err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }
        // else {
        //     console.log("Items saved to database");

        // }
      });
      res.redirect('/');
    } else {
      // listTitle and newListItems are keys present in list.ejs file
      res.render("list", {
        listTitle: day,
        newListItems: results
      });
    }

  });
});

app.post("/", function(req, res) {

  let day = date.getMyDate();
  const itemName = req.body.newItem;
  const listName = req.body.list;




  const item = new Item({
    name: itemName
  });


  if (listName === day) {
    // console.log('saved');
    item.save();
    res.redirect('/');
  } else {
    Mylist.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });
  }
});

// methods for "/about"
app.get('/about', function(req, res) {
  res.render('about');
});


app.post('/about', function(req, res) {})

app.listen(port, () => {
  console.log("server is running");
});


// for deleting item
app.post('/delete', function(req, res) {
  const checkedItemId = req.body.checkItem;
  const listName = req.body.listName;
  let day = date.getMyDate();

  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        res.redirect('/');
      }
    });

  } else {
    Mylist.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }
});


//route parameteres
app.get('/:varUrl', function(req, res) {
  const varUrl = _.capitalize(req.params.varUrl);
  // console.log(varUrl);


  //creating list by using route parameteres
  Mylist.findOne({
    name: varUrl
  }, function(err, foundList) {
    if (!foundList) {
      const list = new Mylist({
        name: varUrl,
        items: defaultItems
      });
      list.save();
      res.redirect('/' + varUrl);
      // console.log("new list saved");
    } else {
      res.render('list', {
        listTitle: varUrl,
        newListItems: foundList.items
      });
    }

  });
});
