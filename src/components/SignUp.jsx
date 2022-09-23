var axios = require('axios');
var data = "{
	'username': 'bob_baker',
	'secret': '123123',
	'email': 'bob@mail.com',
	'first_name': 'Bob',
	'last_name': 'Baker',
}";

var config = {
	method: 'post',
	url: 'https://api.chatengine.io/users/',
	headers: {
		'PRIVATE-KEY': '{{38df1ec6-e9b4-45fb-acc5-84d350654ce1}}'
	},
	data : data
};

axios(config)
.then(function (response) {
	console.log(JSON.stringify(response.data));
})
.catch(function (error) {
	console.log(error);
});