#encoding:utf-8
from django.contrib import admin
from device.models import Device,DevType,DevCata

class DeviceAdmin(admin.ModelAdmin):
	list_display = ('dev_type','place','manager')
admin.site.register(Device,DeviceAdmin)
admin.site.register(DevType)
admin.site.register(DevCata)