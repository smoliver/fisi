module.exports = {
	toString: function (attributes){
		var str = ''
		var keys = Object.keys(attributes)
		for (var i = 0; i < keys.length; ++i){
			var key = keys[i]
			var value = attributes[key]
			str += key + '="' + value + '" '
		}
		return str
	}
}