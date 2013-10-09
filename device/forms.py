#encoding:utf-8
from django import forms

from device.models import DevCata,DevType,Device,Maintain

class DeviceForm(forms.ModelForm):
	dev_cata = forms.ModelChoiceField(label='设备型号',queryset=DevCata.objects)
	dev_type = forms.ChoiceField(label="",widget=forms.Select(attrs={'style':'display:none;'}))
	code = forms.CharField(label='识别码')
	serial = forms.CharField(label='序列号')
	place = forms.CharField(label='安装地点')
	manager = forms.CharField(label='管理人')
	form_type = forms.CharField(widget=forms.HiddenInput(),initial="device")
	class Meta:
		model = Device
		fields = ['dev_cata','dev_type','code','serial','place','manager','form_type']

class DevTypeForm(forms.ModelForm):
	dev_cata = forms.ModelChoiceField(label='设备分类',queryset=DevCata.objects)
	name = forms.CharField(label='设备型号')
	unit = forms.CharField(label='单位')
	price = forms.CharField(label='价格')
	form_type = forms.CharField(widget=forms.HiddenInput(),initial="devtype")
	class Meta:
		model = DevType
		fields = ['dev_cata','name','unit','price','form_type']

class DevCataForm(forms.ModelForm):
	name = forms.CharField(label='分类名称')
	form_type = forms.CharField(widget=forms.HiddenInput(),initial="devcata")
	class Meta:
		model = DevCata
		fields = ['name','form_type']
