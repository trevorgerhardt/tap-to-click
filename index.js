
/**
 * Is touch moving?
 */

var moving = false;

/**
 * Recent click?
 */

var recentClick = false;

/**
 * dblclick timeout
 */

var timeout = 500;

/**
 * Expose `capture`
 */

module.exports = capture;

/**
 * Add listeners for all touch events
 */

function capture(customTimeout) {
  timeout = customTimeout || timeout;
  document.addEventListener('touchstart', handler, true);
  document.addEventListener('touchmove', handler, true);
  document.addEventListener('touchend', handler, true);
  document.addEventListener('touchcancel', handler, true);
}

/**
 * Handle all touch events
 */

function handler(event) {
  var touch = event.changedTouches[0];

  switch(event.type) {
  case 'touchstart': 
    moving = false;
    dispatch('mousedown', touch); 
    break;
  case 'touchmove':
    moving = true;
    dispatch('mousemove', touch); 
    break;        
  case 'touchend':
    dispatch('mouseup', touch);

    // If the user wasn't moving
    if (!moving) {
      // dispatch a click event
      dispatch('click', touch);

      // prevent an automatic click from happening
      event.preventDefault();
      event.stopPropagation();

      // If there has been a recent click
      if (recentClick) {
        dispatch('dblclick', touch);
      }
      // Set the recent click to be true and set a timeout to disable it
      recentClick = true;
      setTimeout(function() {
        recentClick = false;
      }, timeout);
    } 
    
    moving = false;
    break;
  }
}

/**
 * Dispatch a simulated event
 */

function dispatch(type, touch) {
  var simulatedEvent = document.createEvent('MouseEvent');
  
  simulatedEvent.initMouseEvent(
      type
    , true // canBubble
    , true // cancelable
    , window // view
    , 1 // detail (click count)
    , touch.screenX
    , touch.screenY
    , touch.clientX
    , touch.clientY
    , false // ctrlKey
    , false // altKey
    , false // shiftKey
    , false // metaKey
    , 0 // button
    , null // relatedTarget
  );

  touch.target.dispatchEvent(simulatedEvent);
}
