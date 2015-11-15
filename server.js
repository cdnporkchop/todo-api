var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function (req, res) {
	var queryParams = req.query; //?completed=true
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.Where(todos, {completed: true});	
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.Where(todos, {completed: false});
	}
	
	res.json(filteredTodos);
})

app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	// todos.forEach(function (todo) {
	// 	if (todo.id === todoId) {
	// 		matchedTodo = todo;
	// 	}
	// });
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}
});

app.post('/todos', function (req, res) {
	// var body = req.body;

	// body = _.pick(body, 'description', 'status', "id");
	var body = _.pick(req.body, 'description', 'status');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	body.id = todoNextId++; //= todoNextId; // or = todoNextId++;
	//todoNextId++;
	todos.push(body);

	//console.log('description: ' + body.description);
	res.json(body);

});

app.delete('/todos:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {'id': todoId});	

	if (!matchedTodo) {
		res.status(404).json({"error":"no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);	
	}	
});

app.put('/todos:id', function (req, res) {
	var todoId = parseInt(req.parms.id);
	var matchedTodo = _.findWhere(todos, {'id': todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		// bad, provided but not boolean
		return res.status(400).send();
	} else {
		// Never provided attribute, no problem here	
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		// bad, provided but string or len > 0
		return res.status(400).send();
	} else {
		// Never provided attribute, no problem here	
	}
	
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});