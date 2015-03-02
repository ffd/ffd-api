var express = require('express');
var scrape = require('metafetch').fetch;
var async = require('async');
var app = express();

var links = require('./links.js');

app.get('/', function(req, res) {
    res.send('FFD API FTW!');
});

app.post('/links/create', function(req, res) {
  var dailyLinks = JSON.parse(req.query.links);

  if (!dailyLinks || dailyLinks.length === 0) {
    res.sendStatus(200);
    return;
  }

  async.forEach(dailyLinks, saveNewLink, function(err) {
    if (err) {
      res.send(400, {error: err});
      return;
    }

    res.sendStatus(201);
  });
});


// Required params: author, link
app.post('/link/create', function(req, res) {
  saveNewLink(req.query, function(err) {
    if (err) {
      res.send(400, {error: err});
      return;
    }

    res.sendStatus(201);
  });
});


app.post('/link/vote/:id', function(req, res) {
  // Vote for link
  links.vote(req.params.id, {
    author: req.query.author
  }, function(err, votes) {
    if (err) {
      res.send(400, {error: err});
      return;
    }
    res.send(200, {votes: votes});
  });
});


app.get('/link/show/:id', function(req, res) {
  // Show one link informations
  // links.get(req.params.id);
});


app.get('/links/since/:date', function(req, res) {
  // Display all links since specific date
  var date = new Date(req.params.date);
  links.getAll({
    since: date
  }, function(err, rows) {
    if (err) {
      res.send(400, {error: err});
      return;
    }

    res.send(200, rows);
  });
});


var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});


function saveNewLink(link, callback) {
  scrape(link.url, {
    flags: {
      images: false,
      links: false
    },
    http: {
      timeout: 30000
    }
  }, scrapeComplete);

  function scrapeComplete(err, meta) {
    if (err) {
      callback(err);
      return;
    }

    links.add({
      url: link.url,
      title: link.title || meta.title,
      description: link.description || meta.description,
      author: link.user.name,
      votes: link.votes || [link.author],
      date: link.date || new Date()
    }, callback);
  }
}
