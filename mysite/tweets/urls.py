from django.conf.urls import patterns, include, url
from views import index, tweet, map_points_json, springtour


urlpatterns = patterns('',
    # Examples:
    url(r'^$',index),
    url(r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'login.html'}, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout', {'next_page': '/'}, name='logout'),
    url(r'^tweet/*$',tweet),
    url(r'^map_points_json$',map_points_json),
    url(r'^springtour$',springtour),
)
