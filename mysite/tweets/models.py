from django.db import models
from django.contrib.auth.models import User
from datetime import datetime 
import re

class Tweet(models.Model):
    user = models.ForeignKey(User)
    tweet = models.CharField(max_length=140, blank=False)
    status = models.CharField(max_length=20, blank=False)
    latitude = models.FloatField(max_length=50)
    longitude = models.FloatField(max_length=50)
    posted = models. BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

 
    @classmethod
    def create(cls, tweet,user,status,latitude,longitude):
        tweet = cls(tweet=tweet,user=user,status=status,latitude=latitude,longitude=longitude)
        return tweet


class TweetDetails(models.Model):
    tweet = models.ForeignKey(Tweet)
    id_str = models.CharField(max_length=140, blank=False) 
    html = models.CharField(max_length=512, blank=False)
    created_at_epoch = models.IntegerField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def stripped_html(self):
        #create a regular expression to strip the tweet 
        regex = re.compile("<blockquote class=\"twitter-tweet\">(.*)</blockquote>")
        return  regex.findall(self.html)[0]

    def stripped_date_html(self):
        return re.sub(r'(&mdash;.*</a>)',"", self.stripped_html)

    @classmethod
    def create(cls,tweet, id_str, created_at, created_at_epoch, html):
        tweetDetails = cls(tweet=tweet, id_str=id_str, created_at=created_at, created_at_epoch=created_at_epoch, retweet_count=retweet_count, html=html)
        return tweetDetails
