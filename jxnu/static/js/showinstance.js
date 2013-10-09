/*JavaScript字符串格式化函数*/
String.format = function(src){
    if (arguments.length == 0) return null;
    var args = Array.prototype.slice.call(arguments, 1);
    return src.replace(/\{(\d+)\}/g, function(m, i){
        return args[i];
    });
};

$(".show #equ_cata li a").click(function(e){
	var li = $(e.target).closest("li");
	li.closest("ul").children("li").removeClass("active");
	li.addClass("active");
	var cata_id = li.data("id")
	getEquClass(cata_id);
});
var getEquClass = function(cata_id){
	$("#equ_instance_container").hide();
	$("#equ_class").hide().html('');
	$.ajax({
		url: "/show/equclass/"+cata_id,
		type: "GET",
		success:function(data){
			data = JSON.parse(data)
			html="";
			if(data.length>0){
				$.each(data,function(i,item){
				html+= '<li data-id="'+item['id']+'"><a>'+item['pattern']+'</a></li>'
				})
			}else{
				html = "无数据";
			}
			$("#equ_class").html(html).show();
			$(".show #equ_class li a").click(function(e){
				var li = $(e.target).closest("li");
				li.closest("ul").children("li").removeClass("active");
				li.addClass("active");
				var class_id = li.data("id");
				getEquInstance(class_id);
			});
			$("#equ_class_container").show();
		}
	})
}
var getEquInstance = function(class_id){
	$("#equ_instance").hide().html('');
	$.ajax({
		url : "/show/equinstance/"+class_id,
		type: 'GET',
		success:function(data){
			data = JSON.parse(data)
			html="";
			if(data.length>0){
				$.each(data,function(i,item){
				html+= '<li data-id="'+item['id']+'"><a>'+item['code']+'</a></li>'
				})
			}else{
				html = "无数据";
			}
			$("#equ_instance").html(html).show();
			$(".show #equ_instance li a").click(function(e){
				var li = $(e.target).closest("li");
				li.closest("ul").children("li").removeClass("active");
				li.addClass("active");
				var instance_id = li.data("id");
				showInstanceDetail(instance_id);
			});
			$("#equ_instance_container").show();
		}
	});
}
var showInstanceDetail = function(instance_id){
	$(".show").slideUp();
	$.ajax({
		url : '/show/detail/'+instance_id,
		type: 'GET',
		success:function(data){
			data = JSON.parse(data)[0];
			fillDetialData(data);
			$("#show_detail").show();
		}
	});
}
var fillDetialData = function(data){
	var trs = $("#detail tbody tr").children();
	for(var i=0;i<trs.length;i++){
		var place = $(trs[i]).find("span");
		var key = place.data("place");
		place.html(data[key]);
	}
	/*设备状态*/
	if(data['status']==1){ /*维修*/
		$(".onmaintain,#detail_log,#maintain_back_button").show();
		$("#maintain_button").hide();
		loadLog(data['id']);
	}else if(data['status']==2){ /*维修过，显示维修记录*/
		$(".onmaintain,.isscrap,.detail_log,#maintain_back_button").hide();
		$("#maintain_button,#detail_log").show();
		loadLog(data['id']);
	}else if(data['status']==3){ /*报废*/
		$(".isscrap").show();
	}else{/*正常*/
		$(".onmaintain,.isscrap,.detail_log,#maintain_back_button").hide();
		$("#maintain_button").show();
	}
	$("#detial_id").val(data['id']);
}

$("#show_detail .close").click(function(){
	$(".show").slideDown();
	$("#show_detail").hide();
})

var loadLog  = function(instance_id){
	$.ajax({
			url:"/show/maintain/" + instance_id,
			type:"GET",
			success:function(logs){
				logs = JSON.parse(logs);
				$("#maintain_id").val(logs[logs.length-1]['id']);
				var html = "";
				var template = '<tr><td><span data-place="maintain_time">{0}</span></td>\
							<td><span data-place="part"></span>{1}</td>\
							<td><span data-place="price"></span>{2}</td>\
							<td><span data-place="iswarranty">{3}</span></td>\
							<td><span data-place="backtime">{4}</span></td></tr>';
				for(var i=0;i<logs.length;i++){
					if(logs[i]['iswarranty']==0){
						logs[i]['iswarranty'] = "否";
					}else if(logs['iswarranty'] == 1){
						logs[i]['iswarranty'] = "是";
					}
					html+=String.format(template,logs[i]['maintain_time'],logs[i]['part'],logs[i]['price'],logs[i]['iswarranty'],logs[i]['back_time'])
				}
				$("#detail_log tbody").html(html);
			}
		})
}


/*送修*/
$("#maintain .submit").click(function(){
	var detial_id = $("#detial_id").val();
	$.ajax({
		url:"/perform/maintain/"+detial_id,
		type:"POST",
		data:{
			instance_id:detial_id,
			maintain_time:$("#maintain_time").val(),
			part:$("#maintain_part").val(),
			price:$("#maitain_price").val(),
			iswarranty:$("input[name='warranty']:checked").val()		
		},
		success:function(data){
			if(data == "success"){
				alert("success");
			}
		}
	})
});


/*返回*/
$("#maintain_back_submit_button").click(function(){
	var maintain_id = $("#maintain_id").val();
	$.ajax({
		url:"/perform/maintainback/"+maintain_id,
		type:"POST",
		data:{back_time:$("#maintain_back_time").val()},
		success:function(data){
			if(data=="success"){
				alert("设备已返回");
			}
		}
	});
});