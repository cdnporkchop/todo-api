var person = {
	name: 'Jorge',
	age: 21
};

function updatePerson (obj) {
	// obj = { 
	// 	name: 'Jorge',
	// 	age: 24
	// }
	obj.age = 24
}

updatePerson(person);
console.log(person);

//Array Example
var grades = [15, 88];

function addGrade(grade) {
	grade.push(30);
	debugger;   //cont repl kill quit   **Launch with node debug filename.js
}

addGrade(grades);
console.log(grades);

function addGrade2(obj) {
	obj = [15, 88, 99];
}

addGrade2(grades);
console.log(grades);
