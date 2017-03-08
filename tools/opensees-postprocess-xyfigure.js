var run = function(args){
	// depatch
	var data = args.recorderdata;
    var xindex = args.choosecolumn[0];
    var yindex = args.choosecolumn[1];
    var xfactor = args.ampfactor[0];
    var yfactor = args.ampfactor[1];
    var datalines = data.split("\n");
    var series = [];
    for (var index in datalines) {
        var dataitems = datalines[index].split(" ");
        var x = parseFloat(dataitems[xindex]) * xfactor;
        var y = parseFloat(dataitems[yindex]) * yfactor;
        series.push([x, y]);
    }
    var highchartjson = {
                chart: {
                    type: "scatter",
                    height: 600
                },
                title: {
                    text: "文件:"+filename
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        lineWidth: 1
                    }
                },
                yAxis: {
                    title: {
                        enabled: false
                    },
                    gridLineWidth: 0.8
                },
                xAxis: {
                    title: {
                        enabled: false
                    },
                    gridLineWidth: 0.8
                },
                series: [{
                    data: series,
                    marker: {
                        enabled: false
                    }
                }]
            }
    var result = [];
    result.push({"type": "highchart", "value": highchartjson});
    return result;
}