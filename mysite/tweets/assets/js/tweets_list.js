(function($){

/*  Backbone.sync = function(method, model, success, error){ 
    success();
  }*/


//Define a model to represent a single tweet
  var Tweet = Backbone.Model.extend({
    defaults: {
		id: '1',
		user:'me',
		tweet:  'One of the top rated interactive agencies in the country is looking to hire a PHP Web Engineer to their growing team here in Boston. If you\'re interested in working on web applications for some of the most visible consumer brands in the world that are used by literally MILLIONS of people every month, this is the place for you. The optimal candidate enjoys working in a fast paced, young, high energy work environment where the work hard play hard mentality is paramount.',
		created_at:'Boston, MA',
		epoch:'982739827398'    
	}
  });


//Define the backbone collection for the tweets
  var Tweets = Backbone.Collection.extend({
    	model: Tweet,
    	url: '/tweets_json',
    	parse: function(response){
    		//lets parse the values recived from the fetch
    		this.total_pages = response.total_pages; 
    		this.perPage = response.per_page;
    		this.page = response.page;
    		this.total = response.total;
    		return response.tweets;
    	}
  });


	/*var GenericAlertView = Backbone.View.extend({ 
		initialize: function(){
	    		_.bindAll(this, 'render'); // every function that uses 'this' as the current object should be in here	
		},

	    render: function(){
				$(this.el).html(this.template(this.model.attributes));
				return this; // for chainable calls, like .render().el
    			}
  		});*/
  
 
  // **ItemView class**: Responsible for rendering each individual `Item`.  on list form
	var TweetListItemView =  Backbone.View.extend({
		tagName: 'tr', 
		initialize: function(){
		    	_.bindAll(this, 'render');
		},
		template: _.template(
				"		<td><%= tweet %></td> " + 
                "		<td><%= username %></td> " + 
                "		<td><%= status %></td> " + 
                "		<td><%= created_at %></td> " 
					),
		render: function(){

				//which color will we use for the to display the background of the row
		   		if (this.model.get("status") == "clean")
		   		{
		   			this.$el.addClass('success');
		   		}
		   		else if (this.model.get("status") == "dirty")
		   		{
		   			this.$el.addClass('error');
		   		}

		   		$(this.el).html(this.template(this.model.attributes));

		   		return this; // for chainable calls, like .render().el
				}
  });




/* This is the original logic before warped a backbone view around it 
  $('#tweet_list_previous').click(function(){

  	if (tweetListView.collection.page > 0)
  	{ 
	  	tweetListView.collection.fetch(
  			{data: {page: tweetListView.collection.page - 1}}
  			);
	}
  });


  $('#tweet_list_next').click(function(){
  	if (tweetListView.collection.page < (tweetListView.collection.total_pages -1))
  	{ 
  		tweetListView.collection.fetch({data: {page: tweetListView.collection.page + 1}});
  	}
  });
*/
  // **This is is resposible for rendering the previous and next which are used to navigate through the menu
	var TweetListPageNavView =  Backbone.View.extend({
		tagName: 'tr', 
		initialize: function(){
		    	_.bindAll(this, 'render','previousPage','nextPage');
		},
		template: _.template(
                "	<td colspan=\"4\"> " + 
                "	  <a class=\"pull-left\" id=\"tweet_list_previous\">previous</a> " + 
                "	  <a class=\"pull-right\" id=\"tweet_list_next\">next</a> " + 
                "	</td> " 
					),
		render: function(){
		   		$(this.el).html(this.template());
		   		return this; // for chainable calls, like .render().el
				},
		events: {
				"click #tweet_list_previous": "previousPage",
				"click #tweet_list_next": "nextPage"
				},
		previousPage: function(e){
				if (this.collection.page > 0)
  				{ 
	  				this.collection.fetch(
  						{data: {page: this.collection.page - 1}}
  					);
				}
				},
		nextPage: function(e){
					if (this.collection.page < (this.collection.total_pages -1))
  					{ 
  						this.collection.fetch({data: {page: this.collection.page + 1}});
  					};
				}
	  })


  // **This is is responsible for the table colum header
	var TweetListPageHeaderView =  Backbone.View.extend({
		tagName: 'tr', 
		initialize: function(){
		    	_.bindAll(this, 'render');
		},
		template: _.template(			
                "<th style=\"width: 65%\">Tweet " + 
                "</th> " + 
                "<th>User</th> " + 
                "<th>Status</th> " + 
                "<th>Date Created</th> "
			),
		render: function(){
		   		$(this.el).html(this.template());
		   		return this; // for chainable calls, like .render().el
				}
	  })

//this renders the whole list by iterating through a given collection and rendering the individual items
var TweetListView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, 'render', 'addAll', 'addItem');//every function t
		this.collection = new Tweets();
      	this.collection.bind('add', this.addItem);
      	this.collection.bind('reset', this.addAll);
     	this.counter = 0;
     	this.render_page_nav();
	 },
	 el: "#tab-2-tbody",
	render: function(){
		this.$el.hide('slow');
		this.addAll();
		return this;
	},
	render_page_nav: function(){
		var tweetListPageNavView = new TweetListPageNavView({collection: this.collection});
		var tweetListPageHeaderView = new TweetListPageHeaderView();
		$('#tweetlistTable thead').append(tweetListPageNavView.render().el);
		$('#tweetlistTable thead').append(tweetListPageHeaderView.render().el);
	},
	addAll: function(){
		this.$el.empty();
		this.collection.forEach(this.addItem);
		this.$el.show('slow');
	},
	addItem: function(item){
		var tweetListItemView = new TweetListItemView({model: item})
		this.$el.append(tweetListItemView.render().el);
		//console.log(tweetListItemView.el);
	}
});






  var tweetListView = new TweetListView();

  tweetListView.collection.fetch({data: {page: 0}});


;




})(jQuery);