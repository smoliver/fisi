function setStyle (elt, property, value, propertyPrefixes, valuePrefixes) {

  // if the property prefixes are unset or empty sets the base property
  if (typeof propertyPrefixes != 'object' || propertyPrefixes.length < 1){
    propertyPrefixes = ['']
  }
  // if the value prefixes are unset or empty set the base value
  if (typeof valuePrefixes != 'object' || valuePrefixes.length < 1){
    valuePrefixes = ['']
  }

  for (var propertyPrefix of propertyPrefixes){
    // Format prefixes with the property
    var prefixedProperty = propertyPrefix === '' ? property : '-' + propertyPrefix + '-' + property

    for (var valuePrefix of valuePrefixes){
      // Format the prefixes with the value
      var prefixedValue = valuePrefix === '' ? value : + valuePrefix + value
      // console.log (prefixedProperty + " : " + prefixedValue)
      elt.style[prefixedProperty] = prefixedValue
    }
  }
}


function transition (elt, property, fromVal, toVal,  duration, propertyPrefix, valuePrefix, callback){
    var durationSeconds = (duration / 1000) + 's'
    var hickup = 20
    var totalDuration = duration + hickup

    setStyle(elt, 'transition', '0s')
    setStyle(elt, property, fromVal, propertyPrefix, valuePrefix)

    window.setTimeout(function(){
      setStyle(elt, 'transition', property + ' ' + durationSeconds)
      setStyle(elt, property, toVal, propertyPrefix, valuePrefix)
    }, hickup)

    if( callback && typeof callback === 'function'){
      window.setTimeout(callback, totalDuration)
    }
  }


module.exports = {
  setStyle: setStyle,
  transition: transition 
  
}