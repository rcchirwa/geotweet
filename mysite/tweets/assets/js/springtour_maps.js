(function($){

/*  Backbone.sync = function(method, model, success, error){ 
    success();
  }*/


  	var map;

 	$(window).resize(function () {
	    var h = $(window).height(),
	        offsetTop = 60; // Calculate the top offset

	    $('#map-canvas').css('height', (h - offsetTop));
	}).resize();

	function initialize() {
			//console.log("Reached the initialize phase");
	    var mapOptions = {
	      	center: new google.maps.LatLng(42.3317863, -71.1059792),
	      	zoom: 20,
	      	mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    console.log(document.getElementById("#map-canvas"));
	    map = new google.maps.Map(document.getElementById("map-canvas"),
	        mapOptions);
	  }

  //initialize();

  google.maps.event.addDomListener(window, 'load', initialize);

//Define a model to represent a single tweet


//Define a model to represent a single tweet
  var MapCoord = Backbone.Model.extend({
    defaults: {"latitude": "42.3317863", 
			   "longitude": "-71.1059792"}
  });


//Define the backbone collection for the tweets
  var MapCoords = Backbone.Collection.extend({
    	model: MapCoord,
    	url: '/map_points_json',
    	parse: function(response){
    		//lets parse the values recived from the fetch
    		this.total = response.total;
    		return response.map_points;
    	}
  });

  
 
  // **ItemView class**: Responsible for rendering each individual `Item`.  on list form
	var MapMarkerView =  Backbone.View.extend({
		tagName: 'tr', 
		initialize: function(){
		    	_.bindAll(this, 'render');
		},
		render: function(){
				console.log(this.model.get("latitude"));
				console.log(this.model.get("longitude"));
				marker = new google.maps.Marker({				
        			position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
        			map: this.map
      			});
      			marker.setMap(this.map);
			}
	  });

//this renders the whole list by iterating through a given collection and rendering the individual items
var MapMarkersView = Backbone.View.extend({
	initialize: function(options){
		_.bindAll(this, 'render', 'addAll', 'addItem');//every function
		this.collection = new MapCoords();
      	this.collection.bind('add', this.addItem);
      	this.collection.bind('reset', this.addAll);
      	this.map = options.map;
     	this.counter = 0;
	 },
	render: function(){
		this.addAll();
		return this;
	},
	addAll: function(){
		this.collection.forEach(this.addItem);
	},
	addItem: function(item){
		//alert("reached");
		var mapMarkerView = new MapMarkerView({model: item, map: this.map})
		mapMarkerView.render();
	}
});

	
	alert(map);

  var mapMarkersView = new MapMarkersView({map: map});


  mapMarkersView.collection.fetch();

})(jQuery);