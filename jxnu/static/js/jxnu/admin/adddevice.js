define(function(require,exports,module){
  require('jquery')

  var listen = function(classData){
    $("#equ_cata").change(function(){
      $("#equ_class_id").html('');
      $("#equ_class_id").hide();
      var selected_id = $(this).val();
      if(selected_id == "none"){
        return;
      }
      var result = new Array();
      $.each(classData,function(i,item){ 
        if(item["model"] == selected_id){
          result.push(item);
        }
      });
      if(result.length == 0){
        var str = $("#equ_cata").find("option:selected").text()+"分类下无型号，请添加。"
        alert(str);
        return;
      }
      var option = '';
      for(var i=0;i< result.length;i++){
         option += '<option value="'+result[i]["id"]+'">'+result[i]["pattern"]+'</option>'
      }
      $("#equ_class_id").html(option).show();
    })
  }
  return {
    listen:listen
  }
})