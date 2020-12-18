angular.module('upload')
  .directive('myDraggable', ['$document', '$http', '$rootScope', function($document, $http, $rootScope) {
    return {
      restrict: 'A',
      scope: {
        customerInfo: '=info'
      },
      templateUrl: 'entity.html',

      link: function(scope, element, attr) {
        var startX = 0,
          startY = 0,
          x = scope.customerInfo.x,
          y = scope.customerInfo.y;


        element.css({
          position: 'relative',
          top: scope.customerInfo.y + 'px',
          left: scope.customerInfo.x + 'px',
          cursor: 'pointer'
        });

        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          //console.log(event);
          for (var i = 0; i < document.getElementsByClassName("col-md-12")[0].children.length; i++) {
            document.getElementsByClassName("col-md-12")[0].children[i].style.zIndex = 0;
            document.getElementsByClassName("col-md-12")[0].children[i].firstChild.style.boxShadow = 'none';
          }
          element.css({
            'z-index': 1
          });
          element[0].firstChild.style.boxShadow = '24px 24px 22px 0px rgba(200,200,200,0.2)';
          event.preventDefault();
          startX = event.pageX - x;
          startY = event.pageY - y;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
          //console.log(event);
          y = event.pageY - startY;
          x = event.pageX - startX;
          element.css({
            top: y + 'px',
            left: x + 'px'
          });
        }

        function mouseup() {
          console.log(element[0].id, x, y);
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
          console.log(window.location.origin);
          $http({
            method: 'POST',
            url: window.location.origin + '/api/updatePositionModel',
            dataType: 'json',
            data: ObjecttoParams({
              id: element[0].id,
              x: x,
              y: y
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).success(function(data) {
            console.log(data);
            //$rootScope.findAllModels();
          }).error(function(error, status) {
            return;
          });
        }

        scope.showConfig = function(entity, type, idModel) {
          console.log(entity);
          $rootScope.showConfig(entity, type, idModel);
        };

        scope.selectField = function(field, type, idModel) {
          console.log(field);
          $rootScope.showConfig(field, type, idModel);
        };

        scope.addField = function(model) {
          var field = {
            name: '',
            type: ''
          };
          model.fields.push(field);
          console.log(model);
          scope.selectField(field, 'field', model._id);
        };

        scope.viewData = function(model) {
          $rootScope.viewData(model);
        };

        scope.deleteModel = function(model) {
          console.log(model);
          $http.delete(window.location.origin + '/api/deleteModel/' + model).success(function(response) {
            console.log(response);
          }).error(function(error) {
            console.log(error.message);
            if (error.errorEnum == "SECURITY_ERROR" || error.errorEnum == "INVALID_USER") {
              panelInvalidUser(error.message);
              return;
            } else if (error.errorEnum != "NO_RESULT") {
              openPanelMessage("Error", error.message, MessageType.getError());
              return;
            }
          });
        };

      }
    };
  }]);
