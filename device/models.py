#encoding:utf-8
from django.db import models
import simplejson as json
from django.core.exceptions import ValidationError,NON_FIELD_ERRORS

class DevCata(models.Model):
	"""
		设备型号分类，如计算机、平板电脑
	"""
	name = models.CharField(max_length=30)

	def clean(self):
		if len(self.name) == 0:
			raise ValidationError("请填写分类名称")

	def __unicode__(self):
		return self.name

class DevType(models.Model):
	"""
		设备型号，如Apple iPad MD510CH/A
	"""
	dev_cata = models.ForeignKey(DevCata)

	name = models.CharField(max_length=30)
	unit = models.CharField(max_length=10)
	price = models.DecimalField(max_digits=10,decimal_places=2)

	def clean(self):
		if len(self.name) == 0:
			raise ValidationError("请填写型号")
		elif len(self.unit) == 0:
			raise ValidationError("请填写单位")
		elif len(self.price) == 0:
			raise ValidationError("请填写单价")

	def __unicode__(self):
		return self.name

	def JSONData(self):
		return json.dumps(self.DictData())

	def DictData(self):
		meta = dict({
				'id':self.id,
				'devcata':self.dev_cata.name,
				'name':self.name,
				'unit':self.unit,
				'price':self.price,
			});

		return meta

class Device(models.Model):
	"""
		具体设备类，由序列号标识
	"""
	dev_type = models.ForeignKey(DevType)
	code = models.CharField(max_length=30)
	serial = models.CharField(max_length=30)
	place = models.CharField(max_length=30)
	manager = models.CharField(max_length=30)
	addtime = models.DateField(null = True, blank = True)
	status = models.CharField(max_length = 5,default="0")

	def clean(self):
		if len(self.code) == 0:
			raise ValidationError("请填写设备编码")
		elif len(self.serial) == 0:
			raise ValidationError("请填写序列号")
		elif len(self.addtime) == 0:
			raise ValidationError("请填写添加时间")
		elif len(self.place) == 0:
			raise ValidationError("请填写存放地点")
		elif len(self.manager) == 0:
			raise ValidationError("请填写管理人员")

	class Meta:
		permissions = (
			("view_device","can see the Deive List"),
			("maintain_device","can maintain the Device"),
		)

	def JSONData(self):
		return json.dumps(self.DictData())

	def DictData(self):
		meta = dict({
				'id':self.id,
				'devtype':self.dev_type.name,
				'devcata':self.dev_type.dev_cata.name,
				'price':self.dev_type.price,
				'code':self.code,
				'serial':self.serial,
				'place':self.place,
				'manager':self.manager,
				'status':self.status,
				'addtime':self.addtime.strftime(format="%Y-%m-%d"),
				'maintain_log':[x.DictData() for x in Maintain.objects.filter(device=self.id).order_by('-id')]
			});
		if self.status == "3":
			meta['scrap'] = Scrap.objects.get(device=self.id).DictData()
		return meta
	def __unicode__(self):
		return "%s %s %s" % (self.code,self.dev_type.name,self.dev_type.dev_cata.name)

class Maintain(models.Model):
	"""
		维修类
	"""
	device = models.ForeignKey(Device)
	maintain_time = models.DateField()
	part = models.CharField(max_length=250)
	maintain_price = models.DecimalField(max_digits=10,decimal_places=2)
	onwarranty = models.CharField(max_length=5,null = True,blank=True)
	back_time = models.DateField(default=None,null=True,blank=True)

	def JSONData(self):
		return json.dumps(self.DictData())

	def DictData(self):
		meta = dict({
				'id':self.id,
				'maintain_time':self.maintain_time.strftime(format="%Y-%m-%d"),
				'maintain_price':self.maintain_price,
				'part':self.part,
				'onwarranty':self.onwarranty,
				'back_time':self.back_time.strftime(format="%Y-%m-%d") if self.back_time else "",
			});
		return meta

class Scrap(models.Model):
	"""
		报废
	"""
	device = models.ForeignKey(Device)
	time = models.DateField(null = True, blank = True)
	service_life = models.CharField(max_length=10)
	salvage = models.DecimalField(max_digits=10,decimal_places=2)
	approver = models.CharField(max_length=10)

	def JSONData(self):
		return json.dumps(self.DictData())

	def DictData(self):
		meta = dict({
				'scrap_time':self.time.strftime(format="%Y-%m-%d"),
				'service_life':self.service_life,
				'salvage':self.salvage,
				'approver':self.approver,
			});
		return meta