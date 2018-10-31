const showBanner = require('../utils/banner');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const shell = require('shelljs');
const chalk = require('chalk');

const keyStore = '123456789abcedefghijklmnopqrstuvwxyz';

let exercises = require(__dirname + '/workspace/config');
let userData;
let userDataJSON;
let generatedKey;

let generateKey = () => {
	let key = '';
	for(let i = 0; i < 36; i++)
		key += keyStore.charAt(Math.floor(Math.random() * keyStore.length));
	return key;
}

let submitTask = (file) => {
	showBanner();
	setTimeout( () => {
		if(!fs.existsSync(process.cwd() + '/config.json')){
		console.log('Config file doesn\'t exist!');
		process.exit(1);
	}

	userData = fs.readFileSync(process.cwd() + '/config.json', 'utf8');
	userDataJSON = JSON.parse(userData);

	let solutionFile = __dirname + '/workspace/' + exercises[userDataJSON.taskCount].op;

	PythonShell.run(file, null, (err, result) => {

		if(err) {
			console.log(err.toString());
			process.exit(1);
		}
		PythonShell.run(solutionFile, null, (err, sol) => {
			if(err) {
				console.log(err.toString());
				process.exit(1);
			}

			if(result.toString() === sol.toString()){
				userDataJSON.taskCount += 1;
				generatedKey = generateKey();
				userDataJSON.keys.push(generatedKey);
				userData = JSON.stringify(userDataJSON);
				fs.writeFileSync(process.cwd() + '/config.json', userData);
				console.log(chalk.greenBright('\nHurray you\'ve done it!\n'));
				console.log(generatedKey);
			} else{
				console.log(chalk.yellowBright('The solution doesn\'t meet all the output requirements. Have a look again!\n'));
			}
		});
	});
	}, 100);
}

module.exports = submitTask;