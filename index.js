const path = require('path');
const fs = require("fs");

exports.run = () => {
	let config = process.argv.slice(2);
	let dir = config[0];
	let vendorPrefix = config[1];
	dir = path.resolve(dir);
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
	//kebab-case
	let componentName = path.basename(dir);
	let js = getDirective(componentName, vendorPrefix);
	let directivePath = path.join(dir, componentName + ".js");
	fs.writeFileSync(directivePath, js);
	let html = getTemplate();
	let templatePath = path.join(dir, componentName + ".html");
	fs.writeFileSync(templatePath, html);
	console.log(`Directive ${componentName} created`)
}

function getTemplate() {
	let html = 
`
<div class="row">
	<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
	
	</div>
</div>
`;
	return html;
}

//{{componentName}} = search-footer
//{{vendorPrefix}} = cc
function getDirective(componentName, vendorPrefix) {
	let vendorPrefixWithDot = (typeof(vendorPrefix) !== "undefined") ? vendorPrefix + "." : "";
	vendorPrefix = (typeof(vendorPrefix) !== "undefined") ? vendorPrefix : "";
	let matchToUpper = function(x, p1){ return p1.toUpperCase(); };
	let componentNameProper = componentName.replace(/\-([a-z])/g, matchToUpper).replace(/^([a-z])/, matchToUpper);

	let js =
`import template from './${componentName}.html'

export default angular.module('${vendorPrefixWithDot}${componentName}', [])
	.controller('${componentNameProper}Controller', ${componentNameProper}Controller)
	.directive('${vendorPrefix}${componentNameProper}', ${componentNameProper}Directive);

function ${componentNameProper}Directive() {
	return {
		restrict: 'E',
		scope: {},
		bindToController: {

		},
		controllerAs: '$ctrl',
		template: template,
		controller: ${componentNameProper}Controller
	};
}

function ${componentNameProper}Controller() {
	var self = this;
}`;
	return js;
}