var request = require('request');

const chalk  = require('chalk');

// Github endpoint
var urlRoot = "https://api.github.com";

var config = {};
// Retrieve our api token from the environment variables.
config.token = process.env.GITHUBTOKEN;

if( !config.token )
{
	console.log(chalk`{red.bold GITHUBTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

console.log(chalk.green(`Your token is: ${config.token.substring(0,4)}...`));


if (process.env.NODE_ENV != 'test')
{
	(async () => {
		await listAuthenicatedUserRepos();
		await listBranches(owner, "test-repo");
		await createRepo(owner,"test333");
		await createIssue(owner, repo, issueName, issueBody);
		await enableWikiSupport(owner,repo);

	})()
}

function getDefaultOptions(endpoint, method, data1, data2)
{
	var options = {
		url: urlRoot + endpoint,
		method: method,
		headers: {
			"User-Agent": "REST-GITHUB",
			"content-type": "application/json",
			"Authorization": `token ${config.token}`
		},
		body:JSON.stringify({"name": data1, "title": data1, "body": data2, "has_wiki": true})		
	};
	return options;
}

// Get the user.
async function getUser()
{
	let options = getDefaultOptions("/user", "GET");

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			resolve( JSON.parse(body).login );
		});
	});
}

// List the repos of the user.
function listAuthenicatedUserRepos()
{
	let options = getDefaultOptions("/user/repos?visibility=all", "GET");
	

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) 
		{
			if( error )
			{
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			var obj = JSON.parse(body);
			for( var i = 0; i < obj.length; i++ )
			{
				var name = obj[i].name;
				console.log( name );
			}

			// Return object for people calling our method.
			resolve( obj );
		});
	});

}

// Code for listBranches in a given repo under an owner.
async function listBranches(owner,repo)
{
	let options = getDefaultOptions("/repos/"+owner+"/"+repo+"/branches", "GET");

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if(error){
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			var obj = JSON.parse(body);
			for( var i = 0; i < obj.length; i++ )
			{
				var name = obj[i].name;
				console.log( name );
			}
			// console.debug( options );
			resolve( obj );

		});
	});
}

// Code to create a new repo
async function createRepo(owner,repo)
{
	let options = getDefaultOptions("/user/repos", "POST", repo);

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			if(error){
				console.log( chalk.red( error ));
				reject(error);
				return; // Terminate execution.
			}

			
			console.log(response.statusCode);
			resolve( response.statusCode );

		});
	});

}
// Code for creating an issue for an existing repo.
async function createIssue(owner,repo, issueName, issueBody)
{
	let options = getDefaultOptions("/repos/"+owner+"/"+repo+"/issues", "POST", issueName, issueBody);

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			resolve( response.statusCode );

		});
	});
}

// Code for editing a repo to enable wiki support.
async function enableWikiSupport(owner,repo)
{
	let options = getDefaultOptions("/repos/"+owner+"/"+repo, "PATCH");

	// Send a http request to url and specify a callback that will be called upon its return.
	return new Promise(function(resolve, reject)
	{
		request(options, function (error, response, body) {

			var obj = JSON.parse(body);
			resolve( obj );
		});
	});	
}

module.exports.getUser = getUser;
module.exports.listAuthenicatedUserRepos = listAuthenicatedUserRepos;
module.exports.listBranches = listBranches;
module.exports.createRepo = createRepo;
module.exports.createIssue = createIssue;
module.exports.enableWikiSupport = enableWikiSupport;


