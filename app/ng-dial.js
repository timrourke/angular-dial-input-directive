angular.module('dial', []).
directive('dial',['$document', '$window', function($document, $window) {
  return function(scope, element, attr) {
    var startAngle = 0,
        w = 200,
        h = 200,
        x = (parseInt($window.innerWidth) / 2) - (w / 2), 
        y = (parseInt($window.innerHeight) / 2) - (h / 2);
    element.css({
     position: 'absolute',
     top: (parseInt($window.innerHeight) / 2) - (w / 2) + 'px',
     left: (parseInt($window.innerWidth) / 2) - (h / 2) + 'px',
     transform: 'rotateZ(' + startAngle + 'deg)',
     borderRadius: '50%',
     cursor: 'pointer',
     display: 'block',
     width: w + 'px',
     height: h + 'px'
    });
    element.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {
      y = event.clientY;
      x = event.clientX;
      ctrX = $window.innerWidth / 2;
      ctrY = $window.innerHeight / 2;
      angle = (Math.atan2(ctrY - y, ctrX - x) * 180 / Math.PI) - startAngle;
      element.css({
        transform: 'rotateZ(' + (angle + 180) + 'deg)'
      });
    }

    function mouseup() {
      $document.off('mousemove', mousemove);
      $document.off('mouseup', mouseup);
    }
  };
}]);