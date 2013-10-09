from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from jxnu.views import jxnu_login,jxnu_logout
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'jxnu.views.home', name='home'),
    # url(r'^jxnu/', include('jxnu.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^$','device.views.index'),
    url(r'^login/',jxnu_login,name="login"),
    url(r'^logout/',jxnu_logout,name="logout"),

    url(r'^admin/', include(admin.site.urls)),
    url(r'device/',include('device.urls',namespace="device")),
)
