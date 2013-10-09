define(function(require,exports,module){
	var get = require("jxnu/get");
	var admin = (location.pathname == "/device/maintain/")?true:false;
	var index = (location.pathname == "/")?true:false;
	
	String.format = function(src){
	    if (arguments.length == 0) return null;
	    var args = Array.prototype.slice.call(arguments, 1);
	    return src.replace(/\{(\d+)\}/g, function(m, i){
	        return args[i];
	    });
	};

	/**
	*首页隐藏搜索框
	*/
	if(index){
		$("#search-form").closest(".row").slideUp(100);
		$("#header_nav").append("<li id=\"show-search\"><a>搜索</a></li>");
		$("#show-search").click(function(){
			if($("#search-form").closest(".row").css("display") == "none"){
				$("#search-form").closest(".row").slideDown(100);
				$("#search_word").focus();
			}else{
				$("#search-form").closest(".row").slideUp(100);
			}
		});
	}

	$("#login-info").slideDown();
	$("#login-info .close").unbind('click');
	$("#login-info .close").click(function(){
		$("#login-info").fadeOut();
	});

	$("#search-form").submit(function(){
		$("#search-result").html("");
		var search_word = $("#search_word").val();
		$.get('/device/search/'+search_word,function(data){
			var html = "";
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					html+='<li class="label label-info" '+'data-id="'+data[i]['id']+'">';
					html+= data[i]['devtype']+" ";
					html+= data[i]['code'];
					html+="</li>";
				}
			}else{
				html = "没有搜索结果,请输入设备的编码进行搜索";
			}
			$("#search-result").html(html);
			$(".search-result .close").unbind('click');
			$(".search-result .close").click(function(){
				$(".search-result").fadeOut();
			});
			$("#search-result li").click(function(e){
				var target_id = $(e.target).data("id");
				loadDevice(target_id);
			});
		},'json');

		$(".search-result").fadeIn();
		return false;
	});

	$("#equ_cata li a").click(function(e){
		$("#equ_instance_container").hide();
		var li = $(e.target).closest("li");
		li.closest("ul").children("li").removeClass("active");
		li.addClass("active");
		var cata_id = li.data("id")
		var devtype = JSON.parse(get.DevTypeList(cata_id));
		var html="";
		for(var i=0;i<devtype.length;i++){
			if(admin){
				html+= '<li data-id="'+devtype[i]['pk']+'"><a>'+devtype[i].fields['name']+'<i class="icon-remove remove"></i></a></li>'
			}else{
				html+= '<li data-id="'+devtype[i]['pk']+'"><a>'+devtype[i].fields['name']+'</a></li>'
			}
		}
		$("#equ_class_container").show();
		$("#equ_class").html(html);
		if(admin){
			removeListen();
		}
		$("#equ_class li a").click(function(e){
			var li = $(e.target).closest("li");
			li.closest("ul").children("li").removeClass("active");
			li.addClass("active");
			var class_id = li.data("id");
			var device = JSON.parse(get.DeviceList(class_id));
			var html = "";
			for(var i=0;i<device.length;i++){
				if(admin){
					html+= '<li data-id="'+device[i]['id']+'"><a>'+device[i]['code']+'<i class="icon-remove remove"></i></a></li>'
				}else{
					html+= '<li data-id="'+device[i]['id']+'"><a>'+device[i]['code']+'</a></li>'
				}
			}
			$("#equ_instance_container").show();
			$("#equ_instance").html(html);
			if(admin){
				removeListen()
			}
			$("#equ_instance li a").click(function(e){
				var li = $(e.target).closest("li");
				li.closest("ul").children("li").removeClass("active");
				li.addClass("active");
				var instance_id = li.data("id");
				loadDevice(instance_id);
			});
		});
	});

	var loadDevice = function(instance_id){
		if(location.pathname == "/" || location.pathname == "/device/maintain/"){

			$("#detail_log tbody").html("");//清空维修记录
			$("#scrap_log tbody").html("");//清空报废记录

			var deviceDetial = JSON.parse(get.DeviceDetial(instance_id));
			$("#detial_id").val(deviceDetial['id']);
			var trs = $("#detail tbody tr").children();
			for(var i=0;i<trs.length;i++){
				var place = $(trs[i]).find("span");
				var key = place.data("place");
				place.html(deviceDetial[key]);
			}

			if(deviceDetial['maintain_log'].length>0){
				var logs = deviceDetial['maintain_log'];
				var html = "";
				var template = '<tr data-logid="{0}"><td><span data-place="maintain_time">{1}</span></td>\
							<td><span data-place="part"></span>{2}</td>\
							<td><span data-place="maintain_price"></span>{3}</td>\
							<td><span data-place="onwarranty">{4}</span></td>\
							<td><span data-place="backtime">{5}</span></td></tr>';
				for(var i=0;i<logs.length;i++){
					if(logs[i]['onwarranty'] == 0){
						logs[i]['onwarranty'] = "否";
					}else{
						logs[i]['onwarranty'] = "是";
					}
					html+=String.format(template,logs[i]['id'],logs[i]['maintain_time'],logs[i]['part'],logs[i]['maintain_price'],logs[i]['onwarranty'],logs[i]['back_time'])
				}
				$("#detail_log tbody").html(html).closest("#detail_log").show();
			}else{
				$("#detail_log").hide();
			}

			var dstatus = deviceDetial['status'];

			if(dstatus == 3){
				var scrap_log = deviceDetial['scrap'];
				var html = '';
				var template = '<tr><td><span data-place="scrap_time">{0}</span></td>\
							<td><span data-place="service_life"></span>{1}</td>\
							<td><span data-place="salvage"></span>{2}</td>\
							<td><span data-place="approver">{3}</span></td>\
							</tr>';
				html += String.format(template,scrap_log['scrap_time'],scrap_log['service_life'],scrap_log['salvage'],scrap_log['approver']);
				$("#scrap_log tbody").html(html).closest("#scrap_log").show();
			}else{
				$("#scrap_log").hide();
			}
			
			if(dstatus == 0){
				$(".onmaintain,.isscrap").hide();
			}else if(dstatus == 1){
				$(".onmaintain").show();
			}else if(dstatus == 2){
				$(".onmaintain,.isscrap").hide();
			}else{
				$(".isscrap").show();
			}

			/*控制管理面板*/
			if(location.pathname == "/device/maintain/"){
				$("#scrap_button,#maintain_button,#maintain_back_button").hide();
				if(dstatus == 0){
					$("#scrap_button,#maintain_button").show();
				}else if(dstatus == 1){
					$("#maintain_back_button").show();
				}else if(dstatus == 2){
					$("#scrap_button,#maintain_button").show();
				}else{
					;
				}
				var perform = require("jxnu/admin/maintain.js");
				perform.listen();	
			}

			$(".show").slideUp();
			$("#show_detail").show();
			$("#show_detail .close").unbind('click');
			$("#show_detail .close").click(function(){
				$(".show").slideDown();
				$("#show_detail").hide();
			});
		}
	}

	var removeListen = function(){
		$(".remove").unbind("click");
		$(".remove").click(function(e){

			var target = e.target;
			var text = $($(target).closest("a")).text();
			
			if(!confirm("确定要删除 "+text+" ?")){
				return false;
			}

			var target_id = $($(target).closest("li")).data("id");
			var type = $(target).closest("ul").attr("id");
			var dtarget;
			switch(type){
				case 'equ_cata':
					dtarget = 'devcata';
					break;
				case 'equ_class':
					dtarget = 'devtype';
					break;
				case 'equ_instance':
					dtarget = 'device';
					break;
			}
			var url = "/device/delete/"+ dtarget + "/" + target_id;
			
			$.ajax({
				type:'POST',
				url:url,
				data:{csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]")[0].value},
				success:function(data){
					alert("删除成功！");
					location.reload();
				}
			})
			return false;
		});
	}
	return {
		loadDevice:loadDevice,
		removeListen:removeListen
	}

})