var express = require('express');
var mongoose = require('mongoose');
var GoogleImages = require('google-images');
var client = new GoogleImages('001310055279050736320:1rkhztthlfo', 'AIzaSyC7YbQe674pVlTDHaZJN9j4-kASOVNCLiQ');

var app = express();

mongoose.connect('mongodb://username:password@ds135817.mlab.com:35817/imagesearch');

var schema = new mongoose.Schema({
    query: String
});

var dbUrl = mongoose.model("ImageSearch", schema);

app.get('/api/GoogleImages/:query', function(req, res){
    var page = req.query.offset;
    if(page == null){
        page = 1;
    }
    var topic = req.params.query;
    var relevantData = [];
    client.search(topic, {page: page}).then(function(image){
        for(var i = 0; i < image.length; i++){
            var jsonObj = {
                url: image[i].url,
                text: image[i].description,
                parentPage: image[i].parentPage
            };
            relevantData.push(jsonObj);
        }
        dbUrl({query: topic}).save(function(err, data){
            console.log(data);
            if(err){
                throw err;
            }
            else{
                // console.log(data + " has been saved.");
            }
        });
        res.json(relevantData);
    });
});

app.get('/api/recent/', function(req, res){
    // CREDITS TO THIS STACK OVERFLOW POST: https://stackoverflow.com/questions/19584814/select-last-10-entries-in-mongoose
    var query = dbUrl.find({}, null, {limit: 10, sort: {'_id': -1}});
    query.exec(function(err, data){
    // end credit
        var dataArr = [];
        if(err){
            throw err;
        }
        else{
            var numDisplay;
            if(data.length >= 10){
                numDisplay = 9;
            }
            else{
                numDisplay = data.length - 1;
            }
            for(var i = numDisplay; i >= 0; i--){
                var jsonObj = {
                    query: data[i]
                };
                dataArr.push(jsonObj);
            }
        }
        res.json(dataArr.reverse());
    });
});

app.listen(8003);