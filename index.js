var express = require('express');
var scrape = require('metafetch').fetch;
var app = express();

var links = require('./links.js');

app.get('/', function (req, res) {
    res.send('FFD API FTW!');
});

// Required params: author, link
app.post('/link/create', function (req, res) {
  // Scrape link
  scrape(req.query.url, {
        flags: {
            images: false,
            links: false
        },
        http: {
            timeout: 30000
        }
    }, function (err, meta) {
        if (err) return res.send({ sucess: false, error: err });

        // Create new link
        links.add({
            url: req.query.url,
            title: req.query.title || meta.title,
            description: req.query.description || meta.description,
            author: req.query.author,
            votes: req.query.votes || [req.query.author],
            date: req.query.date || new Date()
        }, function(err, id) {
            res.send({
                success: !err,
                error: err,
                id: id
            });
        });
    });
});

app.post('/link/vote/:id', function (req, res) {
    // Vote for link
    links.vote(req.params.id,{
        author: req.query.author
    }, function(err, votes) {
        res.send({
            success: !err,
            error: err,
            votes: votes
        });
    });
});

app.get('/link/show/:id', function (req, res) {
  // Show one link informations
  // links.get(req.params.id);
});

app.get('/links/since/:date', function (req, res) {
    // Display all links since specific date
    var date = new Date(req.params.date);
    links.getAll({
        since: date
    }, function(err, rows) {
        res.send(rows);
    });
});

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port
});