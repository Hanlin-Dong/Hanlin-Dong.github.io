var run = function(args){
	// depatch
	var dimension = args.dimension;
	var num_layer = args.num_layer;
	var num_mesh = args.num_mesh;
	var direction = args.direction;
	var mattag = args.mattag;
	var material = args.material;
	var sectag = args.sectag;
	// further depatch
	var height = dimension[0];
	var width = dimension[1];
    var thick_web = dimension[2];
    var thick_flange = dimension[3];
    var layer_flange = num_layer[0];
    var layer_web = num_layer[1];
    var num_flange = num_mesh[0];
    var num_web = num_mesh[1];
    var moe = material[0];
    var nu = material[1];
    var mor = moe / 2 / (1+nu);
    // as a default situation, 2 axis is parallel to web
    // initiate array
    var ys = [];
    var zs = [];
    // calculate area;
    var flangearea = width * thick_flange / layer_flange / num_flange;
    var webarea = thick_web * (height - 2 * thick_flange) / layer_web / num_web;
    // initialize the tcl command
    var cmd = "section Fiber " + (sectag + 1000) + " {\n";
    cmd += "#" + height + "x" + width + "x" + thick_web + "x" + thick_flange + "\n";
    // flange
      // top flange mesh reference position
    var yref = 0.5 * height - thick_flange / layer_flange / 2.0;
    var zref = -0.5 * width + width / num_flange / 2.0;
      // top flange
    for (var i=0; i<num_flange; i++) {
    	for (var j=0; j<layer_flange; j++) {
    		var y = yref - j * thick_flange / layer_flange;
    		var z = zref + width / num_flange * i;
    		ys.push(y);
    		zs.push(z);
    		if (direction == 1){
    			cmd += "fiber " + z.toFixed(4) + " " + y.toFixed(4) + " " + flangearea.toFixed(4) + " " + sectag + "\n";
    		}
    		else {
    			cmd += "fiber " + y.toFixed(4) + " " + z.toFixed(4) + " " + flangearea.toFixed(4) + " " + sectag + "\n";
    		}
    	}
    }
      // bottom flange mesh reference position
    var yref = -0.5 * height + thick_flange / layer_flange / 2.0;
    var zref = -0.5 * width + width / num_flange / 2.0;
      // bottom flange
    for (var i=0; i<num_flange; i++) {
    	for (var j=0; j<layer_flange; j++) {
    		var y = yref + j * thick_flange / layer_flange;
    		var z = zref + width / num_flange * i;
    		ys.push(y);
    		zs.push(z);
    		if (direction == 1){
    			cmd += "fiber " + z.toFixed(4) + " " + y.toFixed(4) + " " + flangearea.toFixed(4) + " " + sectag + "\n";
    		}
    		else {
    			cmd += "fiber " + y.toFixed(4) + " " + z.toFixed(4) + " " + flangearea.toFixed(4) + " " + sectag + "\n";
    		}
    	}
    }
      //web mesh reference position
    var meshy = (height - 2 * thick_flange) / num_flange;
    var yref = 0.5 * height - thick_flange - meshy / 2.0;
    for (var i=0; i<num_web; i++) {
    	var y = yref - i * meshy;
    	ys.push(y);
    	zs.push(0.0);
    	if (direction == 1){
    			cmd += "fiber 0.0000 " + y.toFixed(4) + " " + webarea.toFixed(4) + " " + sectag + "\n";
    		}
    		else {
    			cmd += "fiber " + y.toFixed(4) + " 0.0000 " + webarea.toFixed(4) + " " + sectag + "\n";
    		}
    }
    // assemble tcl command
    cmd += "}\n";
    // shear stiffness
    cmd += "uniaxialMaterial Elastic " + (sectag + 2000) + " " + mor * tool_torsionStiffness(height, width, thick_web, thick_flange).toFixed(4) + "\n";
    if (direction == 1) {
        cmd += "uniaxialMaterial Elastic " + (3000 + sectag) + " " + (mor * height * thick_web).toFixed(4) + "\n";
        cmd += "uniaxialMaterial Elastic " + (4000 + sectag) + " " + (mor * 5.0/3 * width * thick_flange).toFixed(4) + "\n";
    } else {
        cmd += "uniaxialMaterial Elastic " + (4000 + sectag) + " " + (mor * height * thick_web).toFixed(4) + "\n";
        cmd += "uniaxialMaterial Elastic " + (3000 + sectag) + " " + (mor * 5.0/3 * width * thick_flange).toFixed(4) + "\n";
    }
    cmd += "section Aggregator " + sectag + " " + (3000+sectag) + " Vy " + (4000+sectag) + " Vz " + (2000+sectag) + " T -section " + (1000+sectag) + "\n";
    alert(cmd);
    // assemble result
    var result = [{"type": "markdown", "value": "## 纤维截面生成代码："}, {"type": "textarea", "value": cmd}];
    return result;
}


var tool_torsionStiffness = function(height, width, web, flange) {
	k1 = width * Math.pow(flange, 3) * (1.0/3-0.21*flange/width*(1-Math.pow(flange/width, 4)/12))
    k2 = 1.0/3*(0.5*height-flange)*Math.pow(web, 3)
    r = (web*web + 4*flange*flange)/(8.0*flange)
    alpha =  Math.min(web, flange)*1.0/Math.max(web, flange)*(0.15+0.1*r/flange)
    d = (Math.pow(flange+r, 2)+r*web+Math.pow(web/2.0, 2))*1.0/(2*r+flange)
    return 2*k1+k2+2*alpha*Math.pow(d, 4)
}