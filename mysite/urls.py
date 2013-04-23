from django.conf.urls import patterns, include, url
from mysite.tweets.urls import urlpatterns as tweet_url_patterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
  )

#use imported import tweets app url patterns to use here
urlpatterns += tweet_url_patterns;
