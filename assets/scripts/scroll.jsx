var Style = require ('./fast-style')
require ('../styles/scrollView.scss')

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: true, 38: true, 39: true, 40: true}
var directions = { 'Up': -1, 'Down': 1 }
var UP = -1
var DOWN = 1

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
  }
}

function addClass (elt, className, tags){
  if(elt.classList){
    elt.classList.add(className)
  }
  else {
    elt.className += ' ' + className
  }
}

function removeClass (elt, className){
  if(elt.classList){
    elt.classList.remove(className)
  }
  else {
    elt.className = elt.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function translateY(px){
  return "translateY(" + px +"px)"
}

exports = module.exports = {

  Section: function (sectionId, onEnter, onExit){

    var sectionElt = document.getElementById( sectionId )

    this.listeners = {}

    var scroll = false

    function disableScroll () {
      sectionElt.onwheel = preventDefault;
      sectionElt.ontouchmove  = preventDefault;
    }

    function enableScroll() {
      sectionElt.onwheel = null;
      sectionElt.ontouchmove  = null;
    }

    this.senseScroll = function (willIt) {
      scroll = willIt
      if(willIt){
        addClass( sectionElt, "scroll" )
        enableScroll ()
      }
      else {
        removeClass( sectionElt, "scroll" )
        disableScroll ()
      }
    }

    this.hasScroll = function (){
      return scroll
    }

    this.getElement = function() {
      return sectionElt
    }

    this.getId = function (){
      return sectionId
    }

    this.enter = function () {
      if( typeof onEnter === 'function' ){
        onEnter()
      }
    }

    this.exit = function () {
      if( typeof onExit === 'function' ){
        onExit()
      }
    }
  },

  sections:[],

  currentSection: undefined,

  switchSection: function(toSection, fromSection, direction){
    // console.log("switchSection")
    var windowHeight = window.innerHeight
    var duration = 900
    var toElt = toSection.getElement()

    if( fromSection != undefined ){
      var fromElt = fromSection.getElement()
      fromSection.exit()
      fromSection.senseScroll(false)

      var switchActive = function(){
        removeClass(fromElt, 'current-section')
        addClass(toElt, 'current-section' )
        removeClass(toElt, 'next-section' )
        toSection.senseScroll(true)
        // toSection.enter()
      }.bind(this) 

      //if from section exists, animate from it
      addClass(toElt, "next-section")
      fromSection.exit()
      toSection.enter()
      // console.log("scrolling " + (direction === UP ? "up" : "down"))


      var tags = ['', 'webkit', 'ms']

      var mod = direction === UP ? 1 : -1
      Style.transition(fromElt, 'transform', translateY(0), translateY(mod * windowHeight), duration, tags)
      Style.transition(toElt, 'transform', translateY(-mod * windowHeight), translateY(0), duration, tags, [''], switchActive)
    }
    else {
      addClass(toElt, "current-section")
      toSection.senseScroll(true)
      toSection.enter()
    }
    this.currentSection = toSection
  },

  getSection: function ( sectionNum ){
    if(sectionNum < this.sections.length){
      return this.sections[sectionNum]
    }
    return undefined
  },

  getSectionIndex: function ( section ){
    return this.sections.indexOf( section )
  },

  sensePaging: function(section, sensivity, deltaY){
    var sectionElt = section.getElement()

    var top = sectionElt.scrollTop
    var bottom = top + window.innerHeight
    var height = sectionElt.scrollHeight

    if((bottom >= height && deltaY > sensivity) || 
      (top <= 0 && deltaY < -sensivity) ){

        var index = this.getSectionIndex( section );
        var direction = deltaY / Math.abs(deltaY)
        var nextIndex = index + direction
        var nextSection = this.getSection(nextIndex)

        if (nextSection){
          this.switchSection(nextSection, section, direction)
        }
    }
  },

  senseMousePaging: function(section, event) {
    if(section.hasScroll()){
      this.sensePaging(section, 10, event.deltaY)  
    }
  },

  senseTouchPaging: function(section, event){
    if(section.hasScroll()){
      var touchY = event.changedTouches[0].clientY
      if(event.type === "touchstart"){
        section.touchStartY = touchY
      }

      else if(event.type === "touchend" && section.touchStartY != undefined){
        var touchDeltaY = section.touchStartY - touchY
        this.sensePaging(section, 10, touchDeltaY)
        section.touchStartY = undefined
      }
    }
  },

  senseKeyPaging: function (event){
    console.log(event)
    if (keys[event.keyCode]) {
      preventDefault(event);
      if(event.keyIdentifier == 'Up' || event.keyIdentifier == 'Down'){
        var direction = directions[event.keyIdentifier]
        var index = this.getSectionIndex (this.currentSection)
        var nextIndex = index + direction
        var nextSection = this.getSection (nextIndex)

        if (nextSection){
          this.switchSection(nextSection, this.currentSection, direction)
        }
      }
    }
  },

  addKeyListener: function () {
    //adds keydown event listener to document to avoid problem redirecting focus
    document.addEventListener ("keydown", this.senseKeyPaging.bind (this))
  },


  addScrollListeners: function (section){
    var sectionElt = section.getElement()

    addClass(sectionElt, 'scroll')

    if (section.listeners["wheel"] === undefined){
      section.listeners["wheel"] = this.senseMousePaging.bind(this, section)
      sectionElt.addEventListener("wheel", section.listeners["wheel"])
    }
    if (section.listeners["mousewheel"] === undefined){
      section.listeners["mousewheel"] = this.senseMousePaging.bind(this, section)
      sectionElt.addEventListener("mouseWheel", section.listeners["mouseWheel"]) 
    }
    if (section.listeners["touchstart"] === undefined){
      section.listeners["touchstart"] = this.senseTouchPaging.bind(this, section)
      sectionElt.addEventListener("touchstart", section.listeners["touchstart"])
    }
    if (section.listeners["touchend"] === undefined){
      section.listeners["touchend"] = this.senseTouchPaging.bind(this, section)
      sectionElt.addEventListener("touchend", section.listeners["touchend"])
    }
  },


  add: function ( section ){
    this.sections.push( section )
    section.senseScroll(false)
    this.addScrollListeners(section)
  },

}