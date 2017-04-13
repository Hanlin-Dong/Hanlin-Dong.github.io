$(document).ready(function(){
    calculate("#tool-run", "#tool-output");
    $(".radio").on("click", function(){
        $(this).siblings("div").each(function(index, sibling){
            $(sibling).find("label").find(":radio").attr("checked", false);
        })
        $(this).find("label").find(":radio").attr("checked", true);
    });
    $(":file").on("change", function(){
        var selector = $("#"+$(this).attr("id")+"_result");
        var files = this.files;
        if (files.length){
            var file = files[0];
            filename = file.name;
            var reader = new FileReader();
            reader.onload = function(){
                selector.val(this.result);
            }
            reader.readAsText(file);
        }
    })

})