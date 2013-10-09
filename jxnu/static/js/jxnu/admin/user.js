define(function(require,exports,module){
	require("jquery");
	var listen = function(){
		$(".reset_password").click(function(e){
			if(!confirm("将重置用户密码为123456")){
				return false;
			}
			var userid = $($(e.target).closest("tr")).data("id");
			$.ajax({
				type:"GET",
				url:'/device/resetpass/'+ userid,
				success:function(data){
					if(data == "success"){
						alert("用户密码重置成功!");
					}
				}
			});
			return false;
		});


		$(".remove_user").click(function(e){
			var userid = $($(e.target).closest("tr")).data("id");
			var username = $($($(e.target).closest("tr")).children(".username")[0]).data("username");
			if(!confirm("确定要删除"+username+"?")){
				return false;
			}
			var userid = $($(e.target).closest("tr")).data("id");
			$.ajax({
				type:"GET",
				url:'/device/removeuser/'+ userid,
				success:function(data){
					if(data == "success"){
						alert("用户删除成功!");
						location.reload();
					}
				}
			});
			return false;
		});
	}
	return {
		listen:listen
	}
})