Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('getLog', function(req, res) {
	Parse.serverURL = 'https://desolate-bayou-57447.herokuapp.com/parse';
	var query = new Parse.Query("chat");
	query.find({
		error: function(err) {
			response.error(err)
		},
		success: function(res) {
			response.success(res)
		}
	});
});