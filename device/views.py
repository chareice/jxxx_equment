#encoding:utf-8
import simplejson as json
from django.http import HttpResponse
from django.template import Context,loader,RequestContext
from  django.shortcuts import render_to_response,redirect

from django.core import serializers
from django.core.exceptions import ValidationError,NON_FIELD_ERRORS
from django.contrib.auth import authenticate,login
from django.contrib.auth.models import User,Group,Permission
from django.contrib.auth.decorators import login_required,permission_required
from django.contrib.auth.forms import UserCreationForm,UserChangeForm

from device.models import DevCata,DevType,Device,Maintain,Scrap
from device.forms import DeviceForm,DevTypeForm,DevCataForm

@login_required(login_url="/login")
def index(request):
	"""
		index page show device list 
	"""
	cataList = DevCata.objects.all()
	return render_to_response('device/index.html',{'cataList':cataList,'current_user':request.user},context_instance=RequestContext(request))


@login_required(login_url="/login")
def get(request,target,id):
	"""
		get list which the target appoint
	"""
	if target == "devtypelist":
		data = serializers.serialize("json", DevType.objects.filter(dev_cata=id))
	elif target == "devicelist":
		data = json.dumps([x.DictData() for x in Device.objects.filter(dev_type=id)])
	elif target == "device":
		data = Device.objects.get(pk=id).JSONData()
	return HttpResponse(data)

@permission_required('device.add_device',login_url="/device/block")
def add(request,action):
	message = {}
	if request.method == "POST":
		try:
			if action == "device":
				name = request.POST.get('name')
				devtype_id = request.POST.get('equ_class_id')
				code = request.POST.get('code')
				serial = request.POST.get('serial')
				addtime = request.POST.get('addtime')
				place = request.POST.get('place')
				manager = request.POST.get('manager')

				if devtype_id == None:
					raise ValidationError("请选择分类")
				device = Device()
				device.dev_type = DevType.objects.get(pk=devtype_id)
				device.code = code
				device.serial = serial
				device.addtime = addtime
				device.place = place
				device.manager = manager

				device.clean()
				device.save()
				message={'type':'success','content':'添加设备成功'}
			
			elif action == "devtype":
				devcataid = request.POST.get('mode')
				name = request.POST.get('pattern')
				unit = request.POST.get('unit')
				price = request.POST.get('price')

				devtype = DevType()
				devtype.dev_cata = DevCata.objects.get(pk=devcataid)
				devtype.name = name
				devtype.unit = unit
				devtype.price = price
				devtype.clean()
				devtype.save()
				message={'type':'success','content':'添加设备型号成功'}

			elif action == "devcata":
				name = request.POST.get('name')
				devcata = DevCata()
				devcata.name = name
				devcata.clean()
				devcata.save()
				message={'type':'success','content':'添加设备分类成功'}
		
		except ValidationError as e:
			message = {'type':'error','content':'; '.join(e.messages)}

		message["exist"] = True
		request.session["message"] = message
		return redirect("device:add",action)

	cataList = DevCata.objects.all()
	typeList = DevType.objects.all()
	if action == "device":
		form = DeviceForm()
		template = 'device/adddevice.html'
	elif action == "devtype":
		form = DevTypeForm()
		template = 'device/adddevtype.html'
	elif action == "devcata":
		form = DevCataForm()
		template = 'device/adddevcata.html'

	if 'message' in request.session:
		message = request.session['message']
		message['exist'] = True
		del request.session['message']

	return render_to_response(template,{'form':form,'action':action,'cataList':cataList,'typeList':typeList,'message':message,'section':'add'},context_instance=RequestContext(request))

@permission_required('device.maintain_device',login_url="/device/block")
def maintain(request,id):
	if request.method == "POST":
		device = Device.objects.get(pk=id)
		m = Maintain()
		m.device = device
		m.maintain_time = request.POST.get('maintain_time')
		m.part = request.POST.get('part')
		m.maintain_price = request.POST.get('price')
		m.onwarranty = request.POST.get('iswarranty')
		m.save()
		device.status = "1"
		device.save()
		return HttpResponse('success')
	cataList = DevCata.objects.all()
	
	return render_to_response('device/maintain.html',{'cataList':cataList,'section':'maintain'},context_instance=RequestContext(request))

@permission_required('device.maintain_device',login_url="/device/block")
def maintainback(request,id):
	if request.method == "POST":
		m = Maintain.objects.get(pk=id)
		m.back_time = request.POST.get('back_time')
		device = Device.objects.get(pk=m.device.id)
		device.status = "2"
		m.save()
		device.save()
		return HttpResponse(device.id)

@permission_required('auth.add_user',login_url="/device/block")
def user(request):
	users = User.objects.order_by('groups')
	return render_to_response('device/user.html',{'users':users,'section':'user'},context_instance=RequestContext(request))

@permission_required('auth.add_user',login_url="/device/block")
def adduser(request):
	if request.method == "POST":
		message = {}
		user = User()
		user.username = request.POST.get('account')
		user.first_name = request.POST.get('first_name')
		user.password = request.POST.get('password')
		user.save()
		user.groups.add(Group.objects.get(pk=request.POST.get('group')))
		
		return render_to_response('device/adduser.html',{'message':message},context_instance=RequestContext(request))

	users = User.objects.order_by('groups')
	groups = Group.objects.order_by("id")
	return render_to_response('device/adduser.html',{'users':users,'groups':groups,'section':'user'},context_instance=RequestContext(request))

@permission_required('auth.add_user',login_url="/device/block")
def edituser(request,id):
	message = {}
	if request.method == "POST":
		user = User.objects.get(pk=id)
		user.username = request.POST.get('account')
		user.first_name = request.POST.get('first_name')
		user.save()
		user.groups.clear()
		user.groups.add(Group.objects.get(pk=request.POST.get('group')))

		groups = Group.objects.order_by("id")
		message['success'] = "修改成功"
		request.session['message'] = message
		return redirect("device:edituser",user.id)
	
	if 'message' in request.session:
		message = request.session['message']
		message['exist'] = True
		del request.session['message']

	user = User.objects.get(pk=id)
	groups = Group.objects.order_by("id")

	return render_to_response('device/edituser.html',{'user':user,'groups':groups,'message':message,'section':'user'},context_instance=RequestContext(request))

@permission_required('auth.add_user',login_url="/device/block")
def resetpass(request,id):
	user = User.objects.get(pk=id)
	user.set_password("123456")
	user.save()
	return HttpResponse("success")

@permission_required('auth.add_user',login_url="/device/block")
def removeuser(request,id):
	user = User.objects.get(pk=id)
	user.delete()
	return HttpResponse("success")

@permission_required('device.maintain_device',login_url="/device/block")
def scrap(request,id):
	if request.method == "POST":
		device = Device.objects.get(pk=id)
		s = Scrap()
		s.device = device
		s.service_life = request.POST.get('service_life')
		s.salvage = request.POST.get('salvage')
		s.approver = request.POST.get('approver')
		s.save()
		device.status = "3"
		device.save()
		return HttpResponse(device.id)

@permission_required('device.maintain_device',login_url="/device/block")
def delete(request,target,id):
	if target == "devcata":
		t = DevCata.objects.get(pk=id)
	elif target == "devtype":
		t = DevType.objects.get(pk=id)
	elif target == "device":
		t = Device.objects.get(pk=id)
	t.delete()

	return HttpResponse("deleted")

@login_required(login_url="/login")
def changepassword(request):
	message = {}
	if request.method == "POST":
		if request.user.check_password(request.POST.get('now_pass')):
			request.user.set_password(request.POST.get("new_pass"))
			message={'type':'success','content':'修改成功'}
		else:
			message={'type':'error','content':'原密码输入错误'}
		request.session['message'] = message
		return redirect("device:changepassword")

	if 'message' in request.session:
		message = request.session['message']
		message['exist'] = True
		del request.session['message']
	return render_to_response('device/changepassword.html',{'message':message,'section':'changepassword'},context_instance=RequestContext(request))

@login_required(login_url="/login")
def search(request,word):
	devices = Device.objects.filter(code__icontains=word)
	return HttpResponse(json.dumps([d.DictData() for d in devices]))