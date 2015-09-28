angular.module('dial', []).
controller('dialController', ['$scope', function($scope){

  $scope.dialAngle = 0;

}]).
directive('dial',['$document', '$window', '$timeout', function($document, $window, $timeout) {
  return {
    restrict: 'E',
    scope: {
      angle: '='
    },
    link: function(scope, element, attrs) {
      var startAngle = scope.angle,
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

      scope.$watch('angle', function(newValue, oldValue){
        updateAngle(newValue - startAngle);
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
        angle = Math.atan2(-(ctrY - y), -(ctrX - x)) * 180 / Math.PI + 180;

        scope.$apply(function(){
          scope.angle = angle + startAngle;
        });
        
        updateAngle(angle);
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }

      function updateAngle(angle) {        
        element.css({
          transform: 'rotateZ(' + (angle + startAngle) + 'deg)'
        });
      }
    }
  }
}]);