var fs = require('fs');

exports.printMsg = function() {
	console.log('This comes from amiautodoc-parser plugin. Test 2');
}

function trim(string) {
	return string.replace(/^\s+|\s+$/g, '');
}

var AmiAutoDoc = function () {
	this.contents = [];
	this.methods = [];
	// this.headers = {};
	// this.headerOrder = [];
	// this.items = [];
};

AmiAutoDoc.load = function (filename, callback) {
	fs.readFile(filename, 'utf-8', function (err, data) {
			if (err) {
				console.log('ERROR: ' + err)
					// return callback(err);
			}
			var amiautodoc = AmiAutoDoc.parse(data);
			// callback(null, amiautodoc);
	});
};


AmiAutoDoc.parse = function (data) {
	data = data.replace(/\r\n/g, '\n');
	// console.log('DATA ===========================');
	// console.log(data);

	var contents = [];
	var methods = [];

	var contentsMode = false;
	var methodsMode = false;

	var lines = data.split(/\n/);
	var lineNum = 0;
	var curMethod = '';
	var prvMethod = '';
	console.log('LINES: ' + lines.length);
	while (lines.length > 0) {
		var line = trim(lines.shift());
		if ((lineNum == 0) && (line != 'TABLE OF CONTENTS')) {
			console.log('ERROR: This is not an Amiga AutoDoc file.')
			// TODO: return error here
		}

		if ((lineNum == 0) && (line == 'TABLE OF CONTENTS')) {
			line = lines.shift();
			lineNum++;
			contentsMode = true;
		}

		if (line != '') {
			// TODO: This is not going to work for AmigaOS 4 SDK autodocs because when the methods section starts the method name is written twice in the same line.
			if (contentsMode && (contents.indexOf(line) > -1)) {
				// console.log('Method found in contents: ' + line);
				contentsMode = false;
				methodsMode = true;
			}


			if (contentsMode) {
				contents.push(line);
			}
			if (methodsMode) {
				if (contents.indexOf(line) > -1) {
					curMethod = line;
				}

			}
		}
		console.log(lineNum);
		console.log(line);
		lineNum++;
	}

	console.log('CONTENTS ===================');
	console.log(contents);
}


// module.exports = function tiny(string) {
// 	if (typeof string !== "string") throw new TypeError("Tiny wants a string!");
// 	return string.replace(/\s/g, "");
// };


module.exports = AmiAutoDoc;
