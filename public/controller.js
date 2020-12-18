angular.module('upload').controller('masterCtrl', ['$scope', '$http', '$location', '$q', '$rootScope', function ($scope, $http, $location, $q, $rootScope) {
  $scope.nameUser = window.localStorage.getItem("name_user");
  $scope.nameAcount = window.localStorage.getItem("name_account");
  $scope.logo = window.localStorage.getItem("logo_account");

  console.log(window.localStorage);

  console.log(window.localStorage.getItem("user_auth"));
  if (window.localStorage.getItem("user_auth")) {
    console.log(window.localStorage.getItem("user_auth"));
    //return;
  }

  $scope.credentials = {
    idAccount: '',
    username: '',
    password: ''
  };

  $scope.ObjecttoParams = function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
      p.push(key + '=' + encodeURIComponent(obj[key]));
    }

    return p.join('&');

  };

  $scope.msjError = null;
  $scope.loginError = false;

  $scope.keyEnter = function (e) {
    if (e.keyCode == 13) {
      $scope.loginUser();
    }
  };

  var params = createObject();
  params = JSON.stringify(params);

  var urlEndPoint = window.localStorage.getItem("URL_WFL") + '/HypersoftDMSServices/loadMassive/';

  /**
   * Metodo implementado para realizar
   * el inicio de session de un usuario en
   * el sistema
   *
   */
  $scope.loginUser = function () {
    $scope.msjError = null;
    console.log(URL_LOGIN);
    window.localStorage.removeItem("user_auth");
    window.localStorage.removeItem("name_user");
    window.localStorage.removeItem("name_account");
    window.localStorage.removeItem("welcome");
    window.localStorage.removeItem("address_client");
    window.localStorage.removeItem("phone_client");
    window.localStorage.removeItem("logo_account");


    if ($scope.credentials.idAccount == undefined || $scope.credentials.idAccount == null || /^\s*$/.test($scope.credentials.idAccount)) {
      $scope.msjError = "El id de la cuenta es obligatorio.";
      var idAccount = document.getElementById('idAccount');
      idAccount.focus();
      return;
    }

    if ($scope.credentials.username == undefined || $scope.credentials.username == null || /^\s*$/.test($scope.credentials.username)) {
      $scope.msjError = "El usuario es obligatorio.";
      var username = document.getElementById('username');
      username.focus();
      return;
    }

    if ($scope.credentials.password == undefined || $scope.credentials.password == null || /^\s*$/.test($scope.credentials.password)) {
      $scope.msjError = "La contraseña es obligatorio.";
      var password = document.getElementById('password');
      password.focus();
      return;
    }

    var dataLogin = $scope.ObjecttoParams({
      nameProject: 4,
      idDNSAccount: $scope.credentials.idAccount,
      user: $scope.credentials.username,
      pass: $scope.credentials.password
    });

    $http({
      method: 'POST',
      url: URL_LOGIN,
      dataType: 'json',
      data: dataLogin,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

    }).success(function (response) {
      console.log(response);
      if (response.DNSWFL.local) {
        $rootScope.URL_WFL = "http://" + response.DNSWFL.ip + ":" + response.DNSWFL.port;
      } else {
        $rootScope.URL_WFL = "https://" + response.DNSWFL.ip;
      }

      window.localStorage.setItem("URL_WFL", $rootScope.URL_WFL);
      window.localStorage.setItem("local", response.DNSWFL.local);
      $scope.idSecMasterAccountDNS = response.DNSWFL.idSecMasterAccount;


      login($rootScope.URL_WFL + "/HypersoftSessionManagerWEB").then(function (data) {
        /**
         * se valida que el id del sec_master_account sean iguales.
         */
        if ($scope.idSecMasterAccountDNS == undefined ||
          $scope.idSecMasterAccountDNS == null ||
          data.master_account == undefined ||
          data.master_account == null) {

          $rootScope.URL_WFL = null;
          window.localStorage.removeItem("URL_WFL");
          //window.location.href = "/workflow/lockscreen.html";
          $scope.msjError = "Por favor revise el id de la cuenta ó su correo electrónico ó contraseña.";
          return;
        }

        if (data.master_account != $scope.idSecMasterAccountDNS) {
          $rootScope.URL_WFL = null;
          window.localStorage.removeItem("URL_WFL");
          //window.location.href = "/workflow/lockscreen.html";
          $scope.msjError = "Por favor revise el id de la cuenta ó su correo electrónico ó contraseña.";
          return;
        }


        var auth2 = {
          oauth: {
            access_token: data.access_token,
            client_id: $scope.credentials.username,
            master_account: data.master_account,
            id_sec_user: data.id_sec_user,
          }
        };

        console.log(data.name);
        console.log("data.address " + data.address + " data.phone " + data.phone);
        window.localStorage.setItem("user_auth", JSON.stringify(auth2));
        window.localStorage.setItem("name_user", data.name);
        window.localStorage.setItem("name_account", data.name_account);
        window.localStorage.setItem("address_client", data.address);
        window.localStorage.setItem("phone_client", data.phone);
        window.localStorage.setItem("valid_user", false);
        window.localStorage.setItem("app", JSON.stringify({
          state: 'workflow',
          imageLogo: 'logoWorkflow',
          imageMenu: 'logoDocumental',
          link: "documental"
        }));
        console.log(" window.location.href es " + window.location.href);
        console.log(window.location.origin, $rootScope.URL_WFL);

        $scope.nameUser = data.name;
        $scope.nameAcount = data.name_account;
        if (response.DNSWFL.local) {
          //window.location.href = 'http://10.10.184.120:3002/'
        } else {
          //window.location.href = window.location.origin;
        }


      }, function (error, status) {
        console.log(error);
        if (error.errorEnum == "SECURITY_ERROR") {
          //$scope.loginError = true;
          $scope.msjError = "Por favor revise el id de la cuenta ó su correo electrónico ó contraseña.";
        } else {
          openPanelMessage("Error", error.message, MessageType.getError());
        }
      });

    }).error(function (error, status) {
      console.log(error);
      console.log(status);
      //$scope.loginError = true;
      $scope.msjError = "Por favor revise el id de la cuenta ó su correo electrónico ó contraseña.";
    });
  };



  function login(URL) {
    var defered = $q.defer();
    var promise = defered.promise;
    var login_params = {};
    login_params.accessKey = acces_key;
    login_params.clientId = $scope.credentials.username;
    login_params.clientSecret = $scope.credentials.password;
    login_params.source = "W";
    login_params = JSON.stringify(login_params);

    $http({
      method: 'POST',
      url: URL + "/auth/access_token/",
      dataType: 'json',
      data: $scope.ObjecttoParams({
        params: login_params
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }

    }).success(function (data) {
      defered.resolve(data);
      console.log(data);

    }).error(function (error, status) {
      defered.reject(error);
      return;
    });
    return promise;
  }

  /**
   * Metodo implementado para cerrar,
   * la sesion de un usuario
   *
   */
  $scope.logout = function () {

    accessToken = JSON.parse(window.localStorage.getItem("user_auth")).oauth.access_token;
    clientID = JSON.parse(window.localStorage.getItem("user_auth")).oauth.client_id;

    $http.get(window.localStorage.getItem("URL_WFL") + SERVER_LOGIN_URL + "/auth/logout/" + acces_key + "/" + clientID + "/" + accessToken).success(function (response) {
      console.log(response);
      clearLocalStorage();
    }).error(function (error) {
      clearLocalStorage();
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

  function clearLocalStorage() {
    window.localStorage.removeItem("user_auth");
    window.localStorage.removeItem("name_user");
    window.localStorage.removeItem("name_account");
    window.localStorage.removeItem("address_client");
    window.localStorage.removeItem("phone_client");
    window.localStorage.removeItem("URL_WFL");
    window.localStorage.removeItem("valid_user");
    window.localStorage.removeItem("local");
    window.localStorage.removeItem("logo_account");
    window.localStorage.removeItem("welcome");
    window.localStorage.removeItem("calendarioAssign");
    //window.location.hash = "#/login";

    $scope.nameUser = window.localStorage.getItem("name_user");
    $scope.nameAcount = window.localStorage.getItem("name_account");
    $scope.logo = window.localStorage.getItem("logo_account");
  }

  $scope.entities = [];
  $scope.createEntity = function () {
    var newEntity = {
      idAcount: 23243,
      name: 'model' + $scope.entities.length,
      x: 50,
      y: 50
    };
    $http({
      method: 'POST',
      url: window.location.origin + '/api/newmodel',
      dataType: 'json',
      data: ObjecttoParams(newEntity),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function (data) {
      console.log(data);
      $rootScope.findAllModels();
    }).error(function (error, status) {
      return;
    });
  };

  $scope.saveChangesEntity = function (object) {
    console.log(object);
    $http({
      method: 'POST',
      url: window.location.origin + '/api/updateModel',
      dataType: 'json',
      data: ObjecttoParams({
        id: object.object._id,
        name: object.object.name
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function (data) {
      console.log(data);
      $rootScope.findAllModels();
      $scope.edit();
    }).error(function (error, status) {
      return;
    });
  };

  $rootScope.findAllModels = function () {
    $http.get(window.location.origin + '/api/allModels').success(function (response) {
      $scope.entities = response;
      console.log(response);
    }).error(function (error) {
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

  $rootScope.findAllModels();

  $scope.objectSelected = undefined;
  $scope.showViewConfig = false;
  $rootScope.showConfig = function (object, type, idModel) {
    console.log('show');
    $scope.showViewConfig = true;
    $scope.objectSelected = {
      object: object,
      type: type,
      idModel: idModel
    };
  };
  $scope.closeConfig = function () {
    $scope.showViewConfig = false;
  };

  $scope.saveField = function (object) {
    console.log(object);
    $http({
      method: 'POST',
      url: window.location.origin + '/api/newField',
      dataType: 'json',
      data: ObjecttoParams({
        idModel: object.idModel,
        field: JSON.stringify(object.object)
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function (data) {
      console.log(data);
      $rootScope.findAllModels();
      $scope.edit();
    }).error(function (error, status) {
      return;
    });
  };

  $scope.saveChangesField = function (object) {
    console.log(object);
    $http({
      method: 'POST',
      url: window.location.origin + '/api/updateField',
      dataType: 'json',
      data: ObjecttoParams({
        idModel: object.idModel,
        field: JSON.stringify(object.object)
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function (data) {
      console.log(data);
      $rootScope.findAllModels();
      $scope.edit();
    }).error(function (error, status) {
      return;
    });
  };

  $scope.showEdit = false;
  $scope.edit = function () {
    $scope.showEdit = $scope.showEdit == false ? true : false;
  };

  $scope.showEditRow = false;
  $scope.editRow = function (fields, row) {
    console.log(fields, row);
    for (var i = 0; i < fields.length; i++) {
      for (var j = 0; j < row.data.length; j++) {
        row.showEditRow = true;
        if (fields[i]._id == row.data[j].field) {
          switch (fields[i].type) {
            case 'String':
              row.data[j].editVal = row.data[j].value;
              break;
            case 'Number':
              row.data[j].editVal = parseInt(row.data[j].value);
              break;
            case 'Boolean':
              row.data[j].editVal = row.data[j].value;
              break;
            case 'Date':
              row.data[j].editVal = new Date(row.data[j].value);
              break;
            default:
              break;
          }
        }
      }
    }
    $scope.showEditRow = $scope.showEditRow == false ? true : false;
  };

  $rootScope.viewData = function (model) {
    console.log(model);
    $scope.showAdd = false;
    $scope.infoTable = model;
    $http.get(window.location.origin + '/api/allDataModels/' + model._id).success(function (response) {
      console.log(response);
      // if (response) {
      //   response.rows = [];
      //   for (var i = 0; i < response.fields.length; i++) {
      //     if (response.fields[i].data.length > 0) {
      //       response.rows.push(response.fields[i].data);
      //     }
      //   }
      $scope.dataTable = response;
      // }
      if ($scope.showTable == false) {
        $scope.viewTable();
      }
    }).error(function (error) {
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

  $scope.showTable = false;
  $scope.viewTable = function () {
    $scope.showTable = $scope.showTable == false ? true : false;
  };

  $scope.showAdd = false;
  $scope.addData = function () {
    $scope.showAdd = true;
  };

  $scope.addDataModels = function (object) {
    console.log(object);
    var fields = [];
    for (var i = 0; i < object.fields.length; i++) {
      fields.push({
        id: object.fields[i]._id,
        value: object.fields[i].input
      });
    }
    $http({
      method: 'POST',
      url: window.location.origin + '/api/addDataModels',
      dataType: 'json',
      data: ObjecttoParams({
        idModel: object._id,
        fields: JSON.stringify(fields)
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function (data) {
      console.log(data);
      $scope.showAdd = false;
      $rootScope.viewData($scope.infoTable);
    }).error(function (error, status) {
      return;
    });
  };

}]);