(function($){


 	$(window).resize(function () {
	    var h = $(window).height(),
	        offsetTop = 100; // Calculate the top offset

	    $('#map-canvas').css('height', (h - offsetTop));
	}).resize();

//Define a model to represent a single tweet


	   //Define a model to represent a single tweet
	  var MapCoord = Backbone.Model.extend({
			initialize: function(){
								this.marker = new google.maps.Marker({				
										position: new google.maps.LatLng(this.get("latitude"), this.get("longitude")),
										geomap: this.geomap
								});
					   		},
			render: function(contentString){
						var infowindow = new google.maps.InfoWindow({
    						content: contentString
						});
  	
  						infowindow.open(this.geomap,this.marker);
						}
		  });


	  //Define the backbone collection for the tweets
	  var MapCoords = Backbone.Collection.extend({
	  		/*initialize: function(){
	  			console.log("collection initialized");
	  		},*/
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
		initialize: function(options){
		    	_.bindAll(this, 'render');
		    	console.log("MapMarkerView: " + options.geomap);
		    	console.log("MapMarkerView: " + options.geomap);
		    	console.log("MapMarkerView: " + this.options.geomap);
		},
		render: function(){
				console.log(this.model.get("latitude"));
				console.log(this.model.get("longitude"));
				marker = new google.maps.Marker({				
        			position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
        			geomap: this.geomap
      			});
      			marker.setMap(this.geomap);
			}
	  });

//this renders the whole list by iterating through a given collection and rendering the individual items
window.MapMarkersView = Backbone.View.extend({
	initialize: function(options){
		_.bindAll(this, 'render', 'addAll', 'addItem','compilemap');//every function
		this.collection = new MapCoords();
      	this.collection.bind('add', this.addItem);
      	this.collection.bind('reset', this.addAll);
     	this.counter = 0;
     	this.compilemap();
	 },
	 compilemap: function() {
	    var mapOptions = {
	      	center: new google.maps.LatLng(42.266667, -71.8),
	      	zoom: 16,
	      	mapTypeId: google.maps.MapTypeId.ROADMAP
	    };

	    this.geomap = new google.maps.Map(document.getElementById("map-canvas"),
	        mapOptions);
	  },
	render: function(){
		this.addAll();
		return this;
	},
	addAll: function(){
		this.collection.forEach(this.addItem);
		var last_elem = this.collection.at(this.collection.length - 1);
		var center = new google.maps.LatLng(last_elem.get('latitude'),last_elem.get('longitude'));
		this.geomap.setCenter(center);
	},
	addItem: function(item){
		item.marker.setMap(this.geomap);
	}
});
})(jQuery);