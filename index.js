var fs = require('fs');

exports.printMsg = function() {
	// console.log('This comes from amiautodoc-parser plugin. Test 2');
}

function trim(string) {
	return string.replace(/^\s+|\s+$/g, '');
}

var AmiAutoDoc = function () {
	this.contents = [];
	this.methods = {};
	// this.headers = {};
	// this.headerOrder = [];
	// this.items = [];
};

var METHOD = function () {
	this.name = '';
	this.function = '';
	this.seealso = '';
	this.example = '';
	this.notes = '';
	this.spinputs = '';
	this.inputs = '';
	this.intro = '';
	this.purpose = '';
	this.synopsis = '';
	this.result = '';
};

AmiAutoDoc.load = function (filename, callback) {
	fs.readFile(filename, 'utf-8', function (err, data) {
			if (err) {
				console.log('ERROR: ' + err)
					// return callback(err);
			}
			var amiautodoc = AmiAutoDoc.parse(data);

			callback(null, amiautodoc);
			// TODO: Maybe add an option to return JSON
			// callback(null, JSON.stringify(amiautodoc));
	});
};


AmiAutoDoc.parse = function (data) {
	data = data.replace(/\r\n/g, '\n');
	// console.log('DATA ===========================');
	// console.log(data);
	var amiautodoc = new AmiAutoDoc();

	var contents = [];
	var methods = [];

	var contentsMode = false;
	var methodsMode = false;
	var mode = '';

	var lines = data.split(/\n/);
	var lineNum = 0;
	var curMethod = '';

	// console.log('LINES: ' + lines.length);
	while (lines.length > 0) {
		var origLine = lines.shift();
		var origLineNT = origLine.replace('\t','');
		var line = trim(origLine);
		if ((lineNum == 0) && (line != 'TABLE OF CONTENTS')) {
			console.log('ERROR: This is not an Amiga AutoDoc file.')
			return 'ERROR';
		}

		if ((lineNum == 0) && (line == 'TABLE OF CONTENTS')) {
			line = lines.shift();
			lineNum++;
			contentsMode = true;
		}

		// TODO: This is not going to work for AmigaOS 4 SDK autodocs because when the methods section starts the method name is written twice in the same line.
		var lineStart = line.split(' ')[0];
		// console.log(lineStart);
		if (contentsMode && (contents.indexOf(lineStart) > -1)) {
			// console.log('Method found in contents: ' + line);
			contentsMode = false;
			methodsMode = true;
		}

		if (contentsMode) {
			if (line != '') {
				contents.push(line);
			}
		}
		if (methodsMode) {
			if (contents.indexOf(lineStart) > -1) {
				if (typeof newMethod !== 'undefined') {
					// console.log(newMethod);
					// methods.push(newMethod);
					methods[curMethod] = newMethod;
				}

				curMethod = lineStart;
				// methods.push(line);
				var newMethod = new METHOD;
			}
			var addContent = true;
			switch (line) {
				case 'NAME':
					mode = 'name';
					addContent = false;
					break;
				case 'FUNCTION':
					mode = 'function';
					addContent = false;
					break;
				case 'SEE ALSO':
					mode = 'seealso';
					addContent = false;
					break;
				case 'EXAMPLE':
					mode = 'example';
					addContent = false;
					break;
				case 'NOTES':
					mode = 'notes';
					addContent = false;
					break;
				case 'SPECIAL INPUTS':
					mode = 'spinputs';
					addContent = false;
					break;
				case 'INPUTS':
					mode = 'inputs';
					addContent = false;
					break;
				case 'PURPOSE':
					mode = 'purpose';
					addContent = false;
					break;
				case 'SYNOPSIS':
					mode = 'synopsis';
					addContent = false;
					break;
				case 'RESULT':
					mode = 'result';
					addContent = false;
					break;
				default:
					if (mode == '') {
						mode = 'intro';
						addContent = false;
					}
			}
			if (line == curMethod) {
				addContent = false;
			}
			if (addContent) {
				// newMethod[mode] += origLineNT;
				// newMethod[mode] += '\n';
				switch(mode) {
					case 'example':
							newMethod[mode] += origLineNT;
							newMethod[mode] += '\n';
						break;
					default:
							newMethod[mode] += line;
							newMethod[mode] += '\n';
				}
			}
		}
		// console.log(lineNum);
		// console.log(line);
		lineNum++;
	}

	if (typeof newMethod !== 'undefined') {
		// console.log(newMethod);
		// methods.push(newMethod);
		methods[curMethod] = newMethod;
	}

	amiautodoc.contents = contents;
	amiautodoc.methods = methods;
	// console.log('CONTENTS ===================');
	// console.log(contents);

	// console.log('METHODS ===================');
	// console.log(methods);

	return amiautodoc;
}


// module.exports = function tiny(string) {
// 	if (typeof string !== "string") throw new TypeError("Tiny wants a string!");
// 	return string.replace(/\s/g, "");
// };


module.exports = AmiAutoDoc;
