// parse tool json file
// by Hanlin Dong on March 6, 2017

var calculate = function(buttonselector, outputselector){
    $(buttonselector).click(function(){
        var toolparam = assemble("#tool-input");
        $(outputselector).html("");
        res = run(toolparam);
        showresult(outputselector, res);
    });
}

var showresult = function(outputselector, res){
    for (var item in res) {
        console.log(res[item].value);
        $(outputselector).append("<div id='output"+item+"'></div>");
        switch (res[item].type) {
            case "markdown":
                $("#output"+item).html(marked(res[item].value));
                break;
            case "highchart":
                $("#output"+item).before("<h2>"+res[item].title+"</h2><br>");
                $("#output"+item).highcharts(res[item].value);
                break;
            case "svg":
                //parse svg.js
                break;
            case "textarea":
                var textarea = $("<textarea></textarea>").addClass("form-control").attr("rows", "10").val(res[item].value);
                var divblock = $("<div></div>").addClass("form-group").append(textarea);
                var formblock = $("<form></form>").attr("role", "form").append(divblock);
                $("#output"+item).append(formblock);
                break;
        }
    }
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, outputselector.replace("#", "")]);
}

var assemble = function(inputselector){
    var toolparam = {};
    var inputs = $(inputselector + ">div");
    $.each(inputs, function(index, dom){
        switch ($(dom).attr("data-type")){
            case "text":
                var id = $(dom).find(":text").attr("id");
                toolparam[id] = $("#"+id).val();
                break;
            case "int":
                var id = $(dom).find(":text").attr("id");
                toolparam[id] = parseInt($("#"+id).val());
                break;
            case "float":
                var id = $(dom).find(":text").attr("id");
                toolparam[id] = parseFloat($("#"+id).val());
                break;
            case "int_array":
                var id = $(dom).find(":text").attr("id");
                var intarray = $("#"+id).val();
                var decodeseries = intarray.split(",");
                var commitarray = [];
                for (var item in decodeseries) {
                    commitarray.push(parseInt(decodeseries[item]));
                }
                toolparam[id] = commitarray;
                break;
            case "float_array":
                var id = $(dom).find(":text").attr("id");
                var floatarray = $("#"+id).val();
                var decodeseries = floatarray.split(",");
                var commitarray = [];
                for (var item in decodeseries) {
                    commitarray.push(parseFloat(decodeseries[item]));
                }
                toolparam[id] = commitarray;
                break;
            case "int_or_array":
                var id = $(dom).find(":text").attr("id");
                var intorarray = $("#"+id).val();
                var decodeseries = intorarray.split(",");
                if (decodeseries.length==1){
                    toolparam[id] = parseInt(intorarray);
                }
                else{
                    var commitarray = [];
                    for (var item in decodeseries){
                        commitarray.push(parseInt(decodeseries[item]));
                    };
                    toolparam[id] = commitarray;
                }
                break;
            case "float_or_array":
                var id = $(dom).find(":text").attr("id");
                var floatorarray = $("#"+id).val();
                var decodeseries = floatorarray.split(",");
                if (decodeseries.length==1){
                    toolparam[id] = parseFloat(floatorarray);
                }
                else{
                    var commitarray = [];
                    for (var item in decodeseries){
                        commitarray.push(parseFloat(decodeseries[item]));
                    };
                    toolparam[id] = commitarray;
                }
                break;
            case "radio":
                var id = $(dom).attr("id");
                var radios = $(dom).find(":radio");
                $.each(radios, function(index, radio){
                    if ($(radio).attr("checked")){
                        toolparam[id] = index;
                    }
                })
                break;
        }
    })
    return toolparam;
}
