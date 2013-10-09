define(function(require,exports,module){
	var monitor = require('jxnu/monitor');
	exports.listen = function(){
		$("#maintain .submit,#maintain_back_submit_button,#scrap_submit_button").unbind("click");
		$("#maintain .submit").click(function(){
			var detial_id = $("#detial_id").val();
			$.ajax({
				url:"/device/maintain/"+detial_id,
				type:"POST",
				data:{
					csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]")[0].value,
					instance_id:detial_id,
					maintain_time:$("#maintain_time").val(),
					part:$("#maintain_part").val(),
					price:$("#maitain_price").val(),
					iswarranty:$("input[name='warranty']:checked").val()		
				},
				success:function(data){
					if(data == "success"){
						alert("设备送修！");
						monitor.loadDevice(detial_id);
						$("#maintain .modal-header button")[0].click();
					}
				}
			})
		});

		$("#maintain_back_submit_button").click(function(){
			$.ajax({
				url:"/device/maintainback/"+$($("#detail_log tbody").children()[0]).data("logid"),
				type:"POST",
				data:{
					back_time:$("#maintain_back_time").val(),
					csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]")[0].value,
				},
				success:function(data){
					alert("设备已返回");
					monitor.loadDevice(data);
					$("#maintain_back .modal-header button")[0].click();
				}
			});
		});

		$("#scrap_submit_button").click(function(){
			$.ajax({
				url:"/device/scrap/"+$("#detial_id").val(),
				type:"POST",
				data:{
					service_life:$("#scrap_service_life").val(),
					salvage:$("#scrap_salvage").val(),
					approver:$("#scrap_approver").val(),
					csrfmiddlewaretoken:$("input[name=csrfmiddlewaretoken]")[0].value,
				},
				
				success:function(data){
					alert("设备报废");
					monitor.loadDevice(data);
					$("#maintain_back .modal-header button")[0].click();
				}
			});
		});
	}
})