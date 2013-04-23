(function($){



	//this allows that map to play nice with boostrap
 	$(window).resize(function () {
	    var h = $(window).height(),
	        offsetTop = 100; // Calculate the top offset

	    $('#map-canvas').css('height', (h - offsetTop));
	}).resize();

//Define a model to represent a single tweet


   //Define a model to represent a set of coordinates
  var MapCoord = Backbone.Model.extend({
  		//initialize the marker with points
		initialize: function(){
							this.marker = new google.maps.Marker({				
									position: new google.maps.LatLng(this.get("latitude"), this.get("longitude")),
									geomap: this.geomap
							});
				   		},
		//this is used to render an info window associated with a marker
		render: function(contentString){
					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});
	
						infowindow.open(this.geomap,this.marker);
					}
	  });


  //Define the backbone collectin for the points
  var MapCoords = Backbone.Collection.extend({
    	model: MapCoord,
    	url: '/map_points_json',
    	parse: function(response){
    		//lets parse the values recieved from the fetch
    		this.total = response.total;
    		return response.map_points;
    	}
  });

  
 
  // **ItemView class**: Responsible for rendering each individual `Marker`.
	var MapMarkerView =  Backbone.View.extend({
		initialize: function(options){
		    	_.bindAll(this, 'render');
		},
		render: function(){
				/*marker = new google.maps.Marker({				
        			position: new google.maps.LatLng(this.model.get("latitude"), this.model.get("longitude")),
        			geomap: this.geomap
      			});*/
      			this.marker.setMap(this.geomap);
			}
	  });

	//this renders all the items in a collection and is how to interface with the backbone
	//this is the only window global variable 
	window.MapMarkersView = Backbone.View.extend({
		initialize: function(options){
			_.bindAll(this, 'render', 'addAll', 'addItem','compilemap');//every function
			//initiate a new backbone collection
			this.collection = new MapCoords();
			this.heatmapData = new Array();
			//bind functions to various backbone actions. 
	      	this.collection.bind('add', this.addItem);
	      	this.collection.bind('reset', this.addAll);
	     	/*This renders that actual map to the screen*/
	     	this.compilemap();
		 },
		 //responsible for compiling a map
		 compilemap: function() {
		    var mapOptions = {
		    	center: new google.maps.LatLng(42.3317302, -71.1061675),
		      	//center: new google.maps.LatLng(42.266667, -71.8),
		      	zoom: 16,
		      	mapTypeId: google.maps.MapTypeId.ROADMAP
		    };
		    this.geomap = new google.maps.Map(document.getElementById("map-canvas"),
		        mapOptions);
		  },
		  renderHeatMap: function(){

		  	var heatmap = new google.maps.visualization.HeatmapLayer({
	  			data: this.heatmapData
			});
			heatmap.setMap(this.geomap);
		  },
		//available to be used to render the 
		render: function(){
			this.addAll();
			return this;
		},
		addAll: function(){
			//will render that whole collection by delegating the rendering of a model to 
			//addItem
			this.collection.forEach(this.addItem);

			//find the last item in the collection so we can use that as the center of the map
			var last_elem = this.collection.at(this.collection.length - 1);

			//set the center coordinates
			var center = new google.maps.LatLng(last_elem.get('latitude'),last_elem.get('longitude'));

			//set the actual map center
			this.geomap.setCenter(center);

			//this.renderHeatMap();
		},
		addItem: function(item){
			//used add the marker associated with the model to a map
			this.heatmapData.push(new google.maps.LatLng(item.get('latitude'),item.get('longitude')));
			item.marker.setMap(this.geomap);
		}
	});
})(jQuery);