# Links API (FFD)

## POST /link/create

Create a new link

__Query parameters__

	{
        url: 'http://google.com', // Required
        title: 'Google', // Will be scraped if no title
        description: 'Website about something', // Will be scraped if no description
        author: 'john', // Required
        votes: "['john']", // By default will be author (should be serialized array)
    }

## POST /link/vote/:id

Add one vote for an existing link.

__URL parameters__

* `:id` is the numeric identifier of the link (ex: `203`)

__Query parameters__

	{
        author: 'john' // Required
    }

## GET /links/since/:date

Get all links since specific dates

__URL parameters__

* `:date` is any valid constructor for javascript `Date` constructor (ex: `/links/since/2015-02-01`)

__Example of returned value__

    [  
       {  
          "id":1,
          "url":"http://tympanus.net/codrops/2015/02/16/create-animated-text-fills/",
          "title":"How to Create (Animated) Text Fills | Codrops",
          "description":"A tutorial on how to create various types of (animated) fills and strokes for text using different techniques including CSS and SVG.",
          "author":"john",
          "votes":[  
             "john", "james"
          ],
          "date":"2015-02-24T15:32:30.991Z"
       }
    ]