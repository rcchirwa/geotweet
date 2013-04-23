from django.conf.urls import patterns, include, url
from views import landing, tweet, checkout, map_points_json, springtour

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$',landing),
    url(r'^login/*',landing),
    url(r'^logout/*',checkout),
    url(r'^tweet/*$',tweet),
    url(r'^map_points_json$',map_points_json),
    url(r'^springtour$',springtour),
)
