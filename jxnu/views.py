#encoding:utf-8
from django.http import HttpResponse
from django.template import Context,loader,RequestContext
from  django.shortcuts import render_to_response,redirect

from django.contrib.auth import authenticate,login,logout

from jxnu.forms import  LoginForm

def jxnu_login(request):
	if request.user.is_authenticated():
		return redirect('/')
	if request.method == "POST":
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username,password=password)
		if user:
			login(request,user)
			return redirect('/')
		else:
			return HttpResponse("无效的用户名和密码")
	else:
		loginform = LoginForm()
		return render_to_response('login.html',{'loginform':loginform},context_instance=RequestContext(request))

def jxnu_logout(request):
	if request.user.is_authenticated():
		logout(request)
		return redirect('/')