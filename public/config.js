
var server_login = 'HypersoftSessionManagerWEB';

acces_key = '6416ff86b1e9bebba1f4ff750eee9f4s';

SERVER_LOGIN_URL = '/' + server_login;

//CLIENT_URL='../workflow/';

error_app = {
  INTERNAL_SERVER_ERROR: 500, //GENERIC_ERROR
  UNAUTHORIZED: 401, //SECURITY_ERROR
  PRECONDITION_FAILED: 412, //INVALID_PARAMS
  NOT_ACCEPTABLE: 406, //CAN_NOT_PERFORM_OPERATION
  NOT_FOUND: 404,
  BAD_REQUEST: 400 //NO_RESULT
};



function openPanelMessage(titulo, message, typeMessage) {
  console.log('Tipo de error es => ' + typeMessage);
  console.log('el mensaje es  => ' + message);
  swal(titulo, message, typeMessage);
}

function createObject(){
	if (window.localStorage.getItem("user_auth")) {
		object = new Object();
		object.accessToken=JSON.parse(window.localStorage.getItem("user_auth")).oauth.access_token;
		object.clientID=JSON.parse(window.localStorage.getItem("user_auth")).oauth.client_id;
		object.sistema = "WEB_ANGULAR";
		object.accountKey=acces_key;

		return object;
	}
}

function ObjecttoParams(obj) {
  var p = [];
  for (var key in obj) {
    p.push(key + '=' + encodeURIComponent(obj[key]));
  }
  return p.join('&');
}

/**
 * funcion que se utiliza para mostrar el mensaje cuando el usuario es invalido.
 * @param tit
 * @param txt
 */
function panelInvalidUser(txt) {
  swal({
    title: "Ha expirado su sesión",
    text: txt,
    showConfirmButton: true,
    confirmButtonText: "Cerrar sesion"
  }, function(isConfirm) {
    angular.element(document.getElementById('idIndex')).scope().logout();
  });
}

//login.hypersoft.co
//var URL_LOGIN = '../HypersoftDNS-WEB/services/findByIdDNSAccount/';
//var URL_LOGIN = 'http://dms-wfl-2012717445.us-west-2.elb.amazonaws.com:8080/HypersoftDNS-WEB/services/findByIdDNSAccount/';
//var URL_LOGIN = 'http://10.10.184.116:8080/HypersoftDNS-WEB/services/findByIdDNSAccount/';
var URL_LOGIN = 'http://127.0.0.1:8080/HypersoftDNS-WEB/services/findByIdDNSAccount/';
//var URL_LOGIN = 'https://api.hypersoftworkflow.co/HypersoftDNS-WEB/services/findByIdDNSAccount/';
