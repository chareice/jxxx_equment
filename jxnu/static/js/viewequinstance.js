$("#equclasslist td").click(function(e){
	var target = $(e.target).closest("tr");
	var target_id = target.children(".equclass_id").data("id");
	
	$.ajax({
		url:"/show/equinstance/"+target_id,
		type:'GET',
		success:function(data){

		}
	});
})