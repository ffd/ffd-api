var sqlite = require('sqlite3');
var fs = require("fs");
var file = "links.db";

fs.exists(file, function(exists){
	if (!exists) {
		db.serialize(function() {
			console.log("CREATE TABLE");
			db.run('CREATE TABLE Links(id INTEGER PRIMARY KEY AUTOINCREMENT,url CHAR(255),title TEXT, description TEXT, author CHAR(64),votes TEXT,date TEXT)');
		});
	}
});

var db = new sqlite.Database(file);

// {
// 	url: 'http://google.com',
// 	title: 'Title'
// 	author: 'jesus',
// 	votes: [
// 		'james',
// 		'john',
// 	],
// 	date: Date('2014-02-22 00:01:00')
// }

var Links = function() {

}

Links.prototype.add = function(params, cb) {

	// @todo: check if link exists

	// Ready to insert
	db.serialize(function() {
		var statement = db.prepare("INSERT INTO Links(url, title, description, author, votes, date) VALUES (?, ?, ?, ?, ?, ?)");
		statement.run(
			[
				params.url,
				params.title,
				params.description,
				params.author,
				JSON.stringify(params.votes || []),
				params.date.toISOString()
			],
			function(err) {
				if (err) {
					cb && cb(err, null);
					return;
				}

				// @todo: send more detailed informations
				cb && cb(false, this.lastID);
			}
		);
	});
};

Links.prototype.get = function(id, params) {

};

Links.prototype.getAll = function(params, cb) {
	db.serialize(function(){
		// @todo: make "since" param optional
		db.all('SELECT * from Links WHERE datetime(date) > datetime(?)', [
				params.since.toISOString()
			], function(err, rows){
			if (err) return cb && cb(err, rows);
			rows = rows.map(function(row){
				row.votes = JSON.parse(row.votes);
				row.date = new Date(row.date);
				return row;
			});
			cb(err, rows);
		});
	});
};

Links.prototype.vote = function(id, params, cb) {
	db.serialize(function(){
		db.get('SELECT votes FROM Links WHERE id = ?', id, function(err, row) {
			var votes = JSON.parse(row.votes);
			votes.push(params.author);

			db.run('UPDATE Links SET votes = ? WHERE id = ?', [JSON.stringify(votes), id], function(err) {
				cb && cb(err, votes);
			});
		});
	})
};

module.exports = new Links();