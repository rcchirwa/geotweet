# Create your views here.
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response, redirect

from django.core import serializers
from django.utils import simplejson

from datetime import datetime
from mysite.tweets.models import Tweet, TweetDetails

import math
import logging
import json
import tweet_handler



#this is the the landing page and it process the login sequance as well 
def index(request): 
    template_out = ""

    if request.method == 'GET':
        #straight get renders the page
        if request.user.is_authenticated():
            return redirect('/tweet')
        template_out = 'login.html'
    #get processed only for the straight gets
    return render_to_response("login.html",{}, context_instance=RequestContext(request))


#create a context to be used in our templates
def user_processor(request):
    return {'username': request.user.username,
            'is_staff': request.user.is_staff}


#the following handles the tweet page with requires the user to be logged in
@login_required(login_url='login')
def tweet(request):   

    if request.method == 'POST':

        user = request.user
        tweet_in = request.POST['tweet']
        gotCoordinates = request.POST['gotCoordinates']


        gotCoordinates = (gotCoordinates=='True');

        if gotCoordinates: 
            latitude = request.POST['latitude']
            longitude = request.POST['longitude']
        else:
            latitude = 0
            longitude = 0




        tweet = Tweet.create(tweet_in,user,'ok',latitude,longitude)
        tweet.save()

        logging.info("tweet.pk: %s" % tweet.pk)

        #post the tweet to the twitter stream and get back the data we want to store 
        twitterDetails = tweet_handler.postTweet(tweet,gotCoordinates)


        tweetDetails = TweetDetails(tweet=tweet, id_str=twitterDetails.id_str, created_at=twitterDetails.created_at, created_at_epoch=twitterDetails.created_at_epoch, html=twitterDetails.html)
 
        tweetDetails.save()

        #this will say the tweet saved sucessfully flag will be used 
        #for cron job to sweep through a repost failed tweets
        tweet.posted = True

        tweet.save()



        data = simplejson.dumps( {'map_points': [{ 
                                'latitude':latitude, 
                                'longitude': longitude,
                                'id':twitterDetails.id_str}],
                                'tweet_html':twitterDetails.html
                                })


        return HttpResponse(data, mimetype='application/json')

    else:
            tweets = Tweet.objects.all()#exclude(latitude__isnull=True).exclude(longitude__isnull=True)
            logging.info(tweets.count())

    return render_to_response("tweet.html", context_instance=RequestContext(request,processors=[user_processor]))



#this is typically used to asyncronously get json data
#login is required to access this information. 
@login_required(login_url='login')
def map_points_json(request):   

    if request.method == 'GET':

        map_points = Tweet.objects.exclude(latitude=0,longitude=0).exclude(latitude__isnull=True,longitude__isnull=True)

        tweetDetails = TweetDetails.objects.filter(tweet__in=map_points)

        ormObj = tweetDetails

        data = simplejson.dumps({'total':ormObj.count(), 
                                'map_points': [{ 
                                'latitude':o.tweet.latitude, 
                                'longitude': o.tweet.longitude,
                                'id': o.id_str
                                } for o in ormObj]})

    return HttpResponse(data, mimetype='application/json')

def isstaff(user):
   return user.is_staff

def springtour(request):   
    #template_out = "springtour.html"
    return render_to_response("springtour.html", context_instance=RequestContext(request,processors=[user_processor]))