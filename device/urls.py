from django.conf.urls import patterns, url

from device import views
urlpatterns = patterns('',
	url(r'^$',views.index,name="index"),
	url(r'^changepassword/',views.changepassword,name="changepassword"),
	url(r'^search/(?P<word>\w+)',views.search,name="search"),

	url(r'^user/',views.user,name="user"),
	url(r'^adduser/',views.adduser,name="adduser"),
	url(r'^edituser/(?P<id>\d+)',views.edituser,name="edituser"),
	url(r'^resetpass/(?P<id>\d+)',views.resetpass,name="resetpass"),
	url(r'^removeuser/(?P<id>\d+)',views.removeuser,name="removeuser"),

	url(r'^maintain/(?P<id>\d+)?',views.maintain,name="maintain"),
	url(r'^scrap/(?P<id>\d+)?',views.scrap,name="scrap"),
	url(r'^delete/(?P<target>\w+)/(?P<id>\d+)',views.delete,name="delete"),
	url(r'^maintainback/(?P<id>\d+)',views.maintainback,name="maintainback"),
	url(r'^add/(?P<action>\w+)',views.add,name="add"),
	url(r'^get/(?P<target>\w+)/(?P<id>\d+)',views.get,name="get"),
)