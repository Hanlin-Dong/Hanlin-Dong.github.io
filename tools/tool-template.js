var run = function(args){
    var mytext = args.mytext;
    var myint = args.myint;
    var myfloat = args.myfloat;
    var myintarray = args.myintarray;
    var myfloatarray = args.myfloatarray;
    var myintorarray = args.myintorarray;
    var myfloatorarray = args.myfloatorarray;
    var myfilesingle = args.myfilesingle;
    var result = [];
    var md = "## 以下是使用Markdown生成的计算书\n" +
             "### 这是二级标题\n" +
             "#### 这是三级标题\n" +
             "这一段是正文部分，可以进行相关描述。\n\n" +
             "文本框的内容可以输入计算书中。如：\n\n" + 
             "文字框： " + mytext + "  \n" +
             "整数与浮点数的积： " + (myint * myfloat) + "  \n" +
             "整数数组： " + myintarray + "  \n" +
             "读取文件内容： " + myfilesingle + "\n\n" +
             "可以输入 \\\\(\\LaTeX\\\\) 格式的公式（注意要用四个反斜杠）：\n\n" +
             "$$\\lambda = N/A=0.9$$\n" +
             "也可以输入多级列表：  \n" +
             "1. 一级项目1\n" +
             "2. 一级项目2\n" +
             "  - 二级项目1\n" +
             "  - 二级项目2\n\n" +
             "这里是Markdown计算书的结尾。";
    var mditem = {"type": "markdown", "value": md};
    result.push(mditem);
    var hc = {
                chart: {
                    type: "scatter"
                },
                title: {
                    text: "这里是图片标题"
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: true
                },
                plotOptions: {
                    series: {
                        lineWidth: 1
                    }
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                },
                series: [{
                    data: [[0,0], [1,2], [2, 3]],
                    marker: {
                        enabled: true
                    }
                }]
            }
    var hcitem = {"type": "highchart", "value": hc, "title": "这里是用Highchart作图的图表", "caption": "x-y关系曲线图"};
    result.push(hcitem);
    return result;
}