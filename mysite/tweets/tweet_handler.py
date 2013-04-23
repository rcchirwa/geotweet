from django.conf import settings

import tweepy
import json
import urllib2
import time
from collections import namedtuple
import re
import logging

#my twitter keys pulled from Settings 
twitter_keys = settings.TWITTER_KEYS


#my twitter app keys
access_token = twitter_keys['access_token'] 
access_token_secret =  twitter_keys['access_token_secret']

#consumer key which allows me to pos to my own timeline so not need for auth2
consumer_key = twitter_keys["consumer_key"]
consumer_secret = twitter_keys["consumer_secret"]

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)


logging.info ( "%s %s" % (consumer_key, consumer_secret))
logging.info ( "%s %s" % (access_token, access_token_secret))

#this creates the authorization.authentication to the api call 
api = tweepy.API(auth)

#public_tweets = tweepy.api.public_timeline()
#for tweet in public_tweets:
#    logging.info(tweet.text)

#logging.info("*********************************888")
#logging.info(api.me())
#logging.info("*********************************888")


'''
The function below is used to post a tweet to the timeline as well as 
collect information from twitter that we would like to house in our datastore
'''

def postTweet(tweet,gotCoordinates):

	#set the text we want to send
	tweet_text = tweet.tweet

	#logging.info(api.me())
	#logging.info(api.user())

	logging.info("**********************")
	logging.info(tweet.tweet)
	logging.info(tweet.latitude)
	logging.info(tweet.longitude)
	
	#this post the actual tweet

	if gotCoordinates:  
		tester = api.update_status(tweet.tweet,'',tweet.latitude,tweet.longitude)
	else:
		tester = api.update_status(tweet.tweet)


	date_time = '%s-%s-%s %s'  % (tester.created_at.year,tester.created_at.month,tester.created_at.day,tester.created_at.time())

	pattern = '%Y-%m-%d %H:%M:%S'

	#compute the related epoch
	epoch = int(time.mktime(time.strptime(date_time, pattern)))


	tweet = tweet_text
	id_str = tester.id_str 
	created_at_time_txt = date_time
	created_at = tester.created_at
	created_at_epoch = epoch
	retweet_count = tester.retweet_count


	#grab information from twitter for the tweet that we just posted
	posted_tweet_json = tweet_json_from_url(id_str)

	#this is the raw html string produced  twitter is you want to repost the tweets
	html = posted_tweet_json['html']

	#create a regular expression to strip the tweet 
	regex = re.compile("<blockquote class=\"twitter-tweet\">(.*)</blockquote>")
	stripped_html = regex.findall(html)[0]

	#define tuple to return	
	TweetDetails = namedtuple('TweetDetails','id_str created_at_time_txt created_at created_at_epoch retweet_count html stripped_html')

	#assign values to namedtuple
	tweetDetails = TweetDetails(id_str,created_at_time_txt,created_at, created_at_epoch, retweet_count, html, stripped_html)
	#return named tuple
	return tweetDetails




'''
The function pulls tweet data based on an id and returns the json string object
'''
def tweet_json_from_url(id_str): 
	tweetCallURL = "https://api.twitter.com/1/statuses/oembed.json?id=%s"%id_str

	p = urllib2.urlopen(tweetCallURL)
	tweetData = p.read()
	tweetJSONData = json.loads(tweetData)

	return tweetJSONData



'''
The function pulls retrieves the tweet recount based on id
'''
def get_tweet_recount_from_id(id_str): 
	tweepy =  api.get_status(id_str)
	return tweepy.retweet_count
