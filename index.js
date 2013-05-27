
/**
 * Expose `capture`
 */

module.exports = capture;

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
  var touch = event.changedTouches[0]
    , target = touch.target
    , tagName = target.tagName.toLowerCase()
    , type = event.type
    , isInput = tagName === 'input' || tagName === 'textarea';

  switch(type) {
  case 'touchstart': 
    moving = false;

    if (!isInput) {
      target.setActive();
    }

    dispatch('mousedown', touch);
    break;
  case 'touchmove':
    moving = true;
    dispatch('mousemove', touch); 
    break;        
  case 'touchend':
    // If the user wasn't moving
    if (!moving) {
      event.preventDefault();

      // dispatch a click event
      dispatch('click', touch);

      // If there has been a recent click
      if (recentClick) {
        dispatch('dblclick', touch);
      }

      // Set the recent click to be true and set a timeout to disable it
      recentClick = true;
      setTimeout(function() {
        recentClick = false;
      }, timeout);
    } else {
      dispatch('mouseup', touch);
    }

    // Focus if it's an input
    if (isInput) {
      target.focus();
    } else {
      target.blur();
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
    , (type === 'dblclick' ? 2 : 1) // detail (click count)
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
