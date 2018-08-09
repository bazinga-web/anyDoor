<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>{{title}}</title>
</head>
<style>
	body {
		margin: 30px;
	}
	a {
		display: block;
		margin-bottom: 5px;
	}
</style>
<body>
	<div>
		{{#each files}}
			<a href="{{../dir}}/{{this}}">{{this}}</a>
		{{/each}}
	</div>
</body>
</html>