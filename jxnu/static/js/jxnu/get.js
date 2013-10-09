define(function(require,exports,module){
	exports.DevTypeList = function(id){
		var data;
		var url = "/device/get/devtypelist/" + id;
		$.ajax({
			url:url,
			type:"GET",
			async:false,
			success:function(result){
				data = result;
			}
		});
		return data;
	};

	exports.DevCataList = function(id){
		var data;
		var url = "/device/get/devcatalist/" + id;
		$.ajax({
			url:url,
			type:"GET",
			async:false,
			success:function(result){
				data = result;
			}
		});
		return data;
	};
	
	exports.DeviceList = function(id){
		var data;
		var url = "/device/get/devicelist/" + id;
		$.ajax({
			url:url,
			type:"GET",
			async:false,
			success:function(result){
				data = result;
			}
		});
		return data;
	};

	exports.DeviceDetial = function(id){
		var data;
		var url = "/device/get/device/"+id;
		$.ajax({
			url:url,
			type:"GET",
			async:false,
			success:function(result){
				data = result;
			}
		});
		return data;
	};
})