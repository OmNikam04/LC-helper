// Function to extract input and output samples from HTML data
// function getSamples(data) {
//     var doc = new DOMParser().parseFromString(data, "text/html");
//     var preElements = doc.getElementsByTagName('pre');
//     var inputs = [];
//     var outputs = [];

//     for (let i = 0; i < preElements.length; i++) {
//         var preText = preElements[i].innerHTML;
//         var input = preText.slice(preText.indexOf("<strong>Input:</strong>") + "<strong>Input:</strong>".length, preText.indexOf("<strong>Output:</strong>")).trim();
//         var output = preText.slice(preText.indexOf("<strong>Output:</strong>") + "<strong>Output:</strong>".length);
        
//         // Remove any additional HTML tags in the output
//         if (output.indexOf("<strong>") != -1) {
//             output = output.slice(0, output.indexOf("<strong>"));
//         }
//         output = output.trim();
        
//         inputs.push(input);
//         outputs.push(output);
//     }
//     return [inputs, outputs];
// }

// // Function to generate C++ code using input and output samples
// function generateCppCode(inputs, outputs) {
//     inputs.forEach(element => {
//         console.log('input', ele)
//     });
//     // Generate C++ code template using the provided samples
//     var cppCode = "// Generated By Leetcode2IDE\n#include <bits/stdc++.h>\nusing namespace std;\n\n";
//     cppCode += "int main() {\n\n";

//     for (var i = 0; i < inputs.length; i++) {
//         cppCode += "\t// Example " + (i + 1) + "\n";
//         cppCode += "\t// Input: " + inputs[i] + "\n";
//         cppCode += "\t// Output: " + outputs[i] + "\n";
//         cppCode += "\t// Add your code here\n\n";
//     }

//     cppCode += "\treturn 0;\n}";

//     return cppCode;
// }

// // Get the HTML content of the LeetCode contest page
// var htmlData = document.documentElement.outerHTML;

// // Extract input and output samples from the HTML data
// var samples = getSamples(htmlData);
// var inputs = samples[0];
// var outputs = samples[1];

// // Generate C++ code using the extracted samples
// var cppCode = generateCppCode(inputs, outputs);

// // Log the generated C++ code (for testing)
// console.log(cppCode);


function getCodeSlug(foo){
	var idx1= foo.indexOf("var pageData =");
	foo=foo.slice(idx1);
	var idx2 = foo.indexOf("</script>");
	foo=foo.slice(0,idx2);
	eval(foo);
	var codeSlug = pageData['codeDefinition'][0]['defaultCode'];
	var funcname = pageData['metaData']['name'];
	return [codeSlug,funcname];
}

function getSamples(data){
	var doc = new DOMParser().parseFromString(data, "text/html");
	d = doc.getElementsByTagName('pre');
	var inputs = [];
	var outputs = [];
	for(let i=0;i<d.length;i++){
		var preText = d[i].innerHTML;
		var input = preText.slice(preText.indexOf("<strong>Input:</strong>")+"<strong>Input:</strong>".length,preText.indexOf("<strong>Output:</strong>")).trim()
		var output = preText.slice(preText.indexOf("<strong>Output:</strong>")+"<strong>Output:</strong>".length)
		if (output.indexOf("<strong>")!=-1){
			output = output.slice(0,output.indexOf("<strong>"));
		}
		output=output.trim();
		inputs.push(input);
		outputs.push(output);
	}
	return [inputs,outputs]
}

function parse_input(input_string){
	input_string = input_string.split(', ')
	var data = []
	for(let i =0;i<input_string.length;i++){
		var varname = input_string[i].split('=')[0].trim();
		var vardata = input_string[i].split('=')[1].trim();
		data.push([varname,vardata]);
	}
	return data;
}
function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}
function isBool(n){
    return typeof(n) == "boolean";
}
function isStr(n){
    return typeof(n) == "string";
}
function isList(a){
	return Array.isArray(a);
}
function getDatatype(data){
	if(isInt(data)){
		return "int";
	}else if(isFloat(data)){
		return "float";
	}else if(isBool(data)){
		return "bool";
	}else if(isStr(data)){
		return "string";
	}else if(isList(data)){
		var temp = getDatatype(data[0]);
		temp = `vector<${temp}>`;
		return temp;
	}else{
		console.log("Unknown Datatype : "+data);
		return "None";
	}
}


function jsontocpp(data,index){
	var res="";
	for(let i =0;i<data.length;i++){
		var varname = data[i][0];
		var datatype = getDatatype(JSON.parse(data[i][1]));
		var vardata = data[i][1];
		vardata = vardata.replaceAll("[","{");
        vardata = vardata.replaceAll("]","}");
        vardata = vardata.replaceAll("False","false");
        vardata = vardata.replaceAll("True","true");
		res += `${datatype} ${varname}${index} = ${vardata};`
		res += "\n\t"
		//console.log(varname+" - "+vardata);
	}
	return res;
}
function jsontocpp2(data,index){
		var res="";
	
		var varname = "output_";
		var datatype = getDatatype(JSON.parse(data));
		var vardata = data;
		vardata = vardata.replaceAll("[","{");
        vardata = vardata.replaceAll("]","}");
        vardata = vardata.replaceAll("False","false");
        vardata = vardata.replaceAll("True","true");
		res += `${datatype} ${varname}${index} = ${vardata};`
		res += "\n\t"
		//console.log(varname+" - "+vardata);
	
	return res;
}

function getSampleVariables(data,index){
	var res=[];
	for(let i =0;i<data.length;i++){
		var varname = data[i][0];
		res.push(`${varname}${index}`);
	}
	return res.join(",");
}

function generateChecker(samples,funcname){
	inputs = samples[0];
	outputs = samples[1];
	var parsed_inputs = [];
	for(let i=0;i<inputs.length;i++){
		parsed_inputs.push(parse_input(inputs[i]));
	}
	var res="";
	for(let i=0;i<inputs.length;i++){
		var x=parsed_inputs[i];
        var y=outputs[i];
		res+=jsontocpp(x,i+1);
		res+=jsontocpp2(y,i+1);
		res+=`if(leetcode2IDE.${funcname}(${getSampleVariables(x,i+1)})==output_${i+1}){\n\t\tcout << "Sample #${i+1} : Accepted" << endl;\n\t}else{\n\t\tcout << "Sample #${i+1} : Wrong Answer" << endl;\n\t}`
		res +="\n"
		res +="\n\t"
	}
	return res;
}

function getTemplate(){
	var temp = localStorage.getItem("TEMPLATE");
	if(temp!=null){
		return temp;
	}
	temp = `
#include <bits/stdc++.h>
using namespace std;



<<func_def>>


int main() {
	
<<samples>>


	return 0;
}
	`	
	return temp;
}

function generateCode(codeSlug,samples,funcname){
	var TEMPLATE = getTemplate();
	TEMPLATE=TEMPLATE.replace("<<func_def>>",codeSlug);
	TEMPLATE=TEMPLATE.replace("<<samples>>","\tSolution leetcode2IDE;\n\t"+generateChecker(samples,funcname));
	
	return TEMPLATE;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Text copied to clipboard');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

function run() {
	console.log('run called')
    // Wait for the page to finish loading
        var data = document.documentElement.outerHTML;
        var codeSlug = getCodeSlug(data)[0];
        var funcname = getCodeSlug(data)[1];
        var samples = getSamples(data);
        var mycode = generateCode(codeSlug, samples, funcname);

        // Copy the generated code to the clipboard
        copyToClipboard(mycode);

}


