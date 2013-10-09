#encoding:utf-8
from django import forms

class LoginForm(forms.Form):
	username = forms.CharField(label='用户名',max_length=50)
	password = forms.CharField(label= '密码',max_length=32, widget=forms.PasswordInput)