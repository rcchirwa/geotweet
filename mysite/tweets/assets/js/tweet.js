	$(function(){



		function initialize() {
			var mapMarkersView = new window.MapMarkersView();
			console.log(mapMarkersView.geomap);
	  	}


	  	var mapMarkersView = new window.MapMarkersView();



		//this handles the tweet submission. 
		$('#tweet_form').submit(function(e){
			e.preventDefault();
			e.stopPropagation();

			$('#tweet_btn').removeClass('btn-primary').text('Saving...').prop('disabled', true);	

			//get what is in the textarea
			var tweet_string = $('#tweet_text').val();

			//I like to to see the best in people so lets assume clean
			var status = "clean";


			var lat_out = 0; 
  			var long_out = 0;
	  		
			var send_tweet = function(gotCoordinatesIn)
			{
				var uri = $('form').attr('action');
		  		var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
		  		//var gotCoordinates = gotCoordinatesIn;

		  		//data to send in json object to the server
				var formData = {csrfmiddlewaretoken: csrfToken, tweet: tweet_string, status: status,latitude: lat_out,longitude: long_out,gotCoordinates: gotCoordinatesIn};

				$.ajax({
        		type: "POST",
        		url: uri,
        		data: formData,
        		timeout: 7500,
        		//for showing user after bad tweet completion
        		after_tweet_modal: function(header,body){
        				$('#tweet_result_modal_header').html(header);
	  					$('#tweet_result_modal_body').html(body);
		  				$('#tweet_result_modal_body').addClass('text-error');
		  				window.setTimeout($('#tweet_result_modal').modal('show'), 2000);		
        		},
        		success: function (data) {
   
	  				if(gotCoordinatesIn){
	  					var center = new google.maps.LatLng(data.map_points[0]['latitude'],data.map_points[0]['longitude'])

	  					mapMarkersView.geomap.setCenter(center);

	  					mapMarkersView.collection.add(data.map_points);

	  					renderNewMapMarker = function(){
	  						mapMarkersView.collection.get(data.map_points[0]['id']).render(data.tweet_html);
	  					}

	  					window.setTimeout(renderNewMapMarker,3500);

	  				}
	 				
	 				$('#tweet_text').val('');
        			$(this).prop('disabled', false);
        			$('#word-counter').text(140)
        		},
        		error: function(jqXHR,textstatus,message) {
        			this.after_tweet_modal("Error: " +textstatus,message);
            		console.log("jqXHR.status: " + jqXHR.status);
                	console.log("teststatus: " + textstatus);
                	console("message: " + message);
        		}
    		}).always(function() { 
    			$('#tweet_btn').prop('disabled', false).addClass('btn-primary').text('Tweet');	
    			});  
			}//end send tweet function

			getCoor = function(position){
				lat_out = position.coords.latitude; 
				long_out = position.coords.longitude;
				send_tweet('True');
			}

			errorCoor = function(){
				send_tweet('False');
				console.log("");
			}


			if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition(getCoor, errorCoor, {maximumAge:60000, timeout:5000, enableHighAccuracy:true});
			}
			else
			{
				console.log("");
			}  
		});


		//this is a global variable
		var toggle_warning = true;

		function tweet_keylogger(inhere,toggler){

			//don't know if this verios of javascript has trim()
			var trimmed_str = inhere.val().replace(/^\s+|\s+$/g, '');

			//check the trimmed string length 
			var str_len = trimmed_str.length;

			//update the counter to reflect how many characters can still be displayed 
			$('#word-counter').text(140-str_len);

			//if the characters are more then 140
			if (str_len > 140){
				//if toggler is true then action needs to be performed
				if (toggler==true){ 
					toggler = false;//reset toggler state
					$('#word-counter').addClass('text-error lead');
					$('#tweet_btn').prop('disabled', true).removeClass('btn-primary');
				}
			}
			else if (str_len > 0)
			{
				if (toggler==false){ 
					toggler = true;//reset toggler stat
					$('#word-counter').removeClass('text-error lead');
					$('#tweet_btn').prop('disabled', false).addClass('btn-primary');	
				}
			}
			else if (str_len == 0)
			{
					toggler = false;
					$('#tweet_btn').prop('disabled', true).removeClass('btn-primary');
			}

			//toggler is only true between 1 and 140
			return toggler
		}

		//This handles any modification or change in the text area
		$('#tweet_text').on('keyup keypress blur change', function(e){
			toggle_warning = tweet_keylogger($(this),toggle_warning);
		});

	})/*end jquery*/