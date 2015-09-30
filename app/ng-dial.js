angular.module('expandingDial', []).
controller('dialController', ['$scope', '$window', function($scope, $window){

  $scope.dialAngle = 0;
  $scope.dialWidth = 200;
  $scope.dialHeight = 200;
  $scope.dialCenter = {
    x: (parseInt($window.innerWidth) / 2), 
    y: (parseInt($window.innerHeight) / 2)
  };

}]).
directive('dial',['$document', '$window', '$timeout', function($document, $window, $timeout) {
  return {
    restrict: 'E',
    scope: {
      angle: '=',
      ellipsewidth: '=',
      ellipseheight: '=',
      ellipsecenter: '='
    },
    template: '<span class="dialSizeHandle"></span><span  class="dialHeightHandle"></span><span class="dialCenterPosHandle">+</span>',
    link: function(scope, element, attrs) {
      var startAngle = scope.angle,
          w = 200,
          h = 200,
          x = (parseInt($window.innerWidth) / 2) - (w / 2), 
          y = (parseInt($window.innerHeight) / 2) - (h / 2),
          ctrX,
          ctrY;

      element.css({
        position: 'absolute',
        top: (parseInt($window.innerHeight) / 2) - (h / 2) + 'px',
        left: (parseInt($window.innerWidth) / 2) - (w / 2) + 'px',
        transform: 'rotateZ(' + startAngle + 'deg)',
        borderRadius: '50%',
        display: 'block',
        width: w + 'px',
        height: h + 'px'
      });

      scope.$watch('angle', function(newValue, oldValue){
        updateAngle(newValue - startAngle);
      });
      
      scope.$watch('ellipsewidth', function(newValue, oldValue){
        updateWidth(newValue);
      });
      
      scope.$watch('ellipseheight', function(newValue, oldValue){
        updateHeight(newValue);
      });

      scope.$watch('ellipsecenter', function(newValue, oldValue){
        console.log(newValue);
        updateCenter(newValue);
      }, true);

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        
        if (event.target.className == 'dialSizeHandle') {
          $document.on('mousemove', resizeEllipse);
        } else if (event.target.className == 'dialHeightHandle') {
          $document.on('mousemove', changeEllipseHeight);
        } else if (event.target.className == 'dialCenterPosHandle') {
          $document.on('mousemove', changeEllipseCenter);
        }
        $document.on('mouseup', mouseup);
      });

      function changeEllipseCenter(event) {
        y = event.clientY;
        x = event.clientX;
        ellipsecenter = {
          x: x,
          y: y
        };

        scope.$apply(function(){
          scope.ellipsecenter = ellipsecenter;
        });

        updateCenter(scope.ellipsecenter);
      }
      
      function changeEllipseHeight(event) {
        y = event.clientY;
        x = event.clientX;
        ctrX = element[0].offsetLeft + (element[0].clientWidth / 2);
        ctrY = element[0].offsetTop + (element[0].clientHeight / 2);
        ellipseheight = calcLinearDistance({x: x, y: y}, {x: ctrX, y: ctrY}) * 2;
        ellipsecenter = {
          x: ctrX,
          y: ctrY
        }
        
        updateHeight(ellipseheight);
        
        scope.$apply(function(){
          scope.ellipseheight = ellipseheight;
          scope.ellipsecenter = ellipsecenter;
        });
      }

      function resizeEllipse(event) {
        y = event.clientY;
        x = event.clientX;
        ctrX = element[0].offsetLeft + (element[0].clientWidth / 2);
        ctrY = element[0].offsetTop + (element[0].clientHeight / 2);
        angle = Math.atan2(-(ctrY - y), -(ctrX - x)) * 180 / Math.PI + 180;
        width = calcLinearDistance({x: x, y: y}, {x: ctrX, y: ctrY}) * 2;
        ellipsecenter = {
          x: ctrX,
          y: ctrY
        }

        updateAngle(angle);
        updateWidth(width);
        
        scope.$apply(function(){
          scope.angle = angle + startAngle;
          scope.ellipsewidth = width;
          scope.ellipsecenter = ellipsecenter;
        });
      }

      function mouseup() {
        $document.off('mousemove', changeEllipseCenter);
        $document.off('mousemove', resizeEllipse);
        $document.off('mousemove', changeEllipseHeight);
        $document.off('mouseup', mouseup);
      }

      function updateAngle(angle) {        
        element.css({
          transform: 'rotateZ(' + (angle + startAngle) + 'deg)'
        });
      }
      
      function updateWidth(width) {
        element.css({
          top: element[0].offsetTop + 'px',
          left: element[0].offsetLeft + element[0].clientLeft + ((ctrX - element[0].offsetLeft)) - (width/2) + 'px', 
          width: width + 'px'
        });
      }
      
      function updateHeight(height) {
        element.css({
          top: element[0].offsetTop + element[0].clientTop + ((ctrY - element[0].offsetTop)) - (height/2) + 'px',
          height: height + 'px'
        });
      }

      function updateCenter(newCenter) {
        console.log(newCenter);
        element.css({
          top: newCenter.y - (element[0].clientHeight / 2) + 'px',
          left: newCenter.x - (element[0].clientWidth / 2) + 'px'
        });
      }
      
      function calcLinearDistance(pointA, pointB) {
        var xSet = pointB.x - pointA.x;
        var ySet = pointB.y - pointA.y;
        return Math.sqrt(Math.pow(xSet, 2) + Math.pow(ySet, 2));
      }
    }
  }
}]);