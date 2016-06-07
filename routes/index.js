var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/author', function(req, res, next) {
  res.render('author');
});


// Autoload de parametros
//se instala con param() para que router.param('id', quizCOntroller.load) solo invoque quizController.load si existe el parametro :id
//quizControler.load() se instala para que se eecute antes que lo necesiten las rutas show y answer y solo en el caso de que path contenga :id, referenciando
//un recurso en la tabla QUiz de la BD qu deba ser procesado por el controlador
router.param('quizId', quizController.load);  // autoload :quizId
router.param('userId', userController.load);  // autoload :userId
router.param('commentId', commentController.load);  // autoload :commentId


// Definición de rutas de sesion
router.get('/session',    sessionController.new);     // formulario login
router.post('/session',   sessionController.create);  // crear sesión
router.delete('/session', sessionController.destroy); // destruir sesión


// Definición de rutas de cuenta
router.get('/users',                    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',      userController.show);    // ver un usuario
router.get('/users/new',                userController.new);     // formulario sign un
router.post('/users',                   userController.create);     // registrar usuario
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired, //indica si es el admin o el usuario de la cuenta
										userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',      sessionController.loginRequired, 
										sessionController.adminOrMyselfRequired, 
										userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',   sessionController.loginRequired, 
										sessionController.adminAndNotMyselfRequired, //comprueba que es admin y que la operacion no cae sobre el
										userController.destroy);  // borrar cuenta

// Definición de rutas de /quizzes
router.get('/quizzes.:format?',                     	quizController.index); //modificdo en p11
router.get('/quizzes/:quizId(\\d+).:format?',       	quizController.show);  //modificdo en p11
router.get('/quizzes/:quizId(\\d+)/check', 	quizController.check);
router.get('/quizzes/new',                 	sessionController.loginRequired, //para craer preguntas
											quizController.new);
router.post('/quizzes',                    	sessionController.loginRequired, //comprueba que esta log in
											quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',  	sessionController.loginRequired, 
										   	quizController.ownershipRequired, //comprueba si el usuario autenticado es el propietario de quiz o es el admin
										   	quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       	sessionController.loginRequired, 
											quizController.ownershipRequired, 
											quizController.update);
router.delete('/quizzes/:quizId(\\d+)',    	sessionController.loginRequired, 
											quizController.ownershipRequired, 
											quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizzes/:quizId(\\d+)/comments/new',  sessionController.loginRequired, 
	                                               commentController.new);
router.post('/quizzes/:quizId(\\d+)/comments',     sessionController.loginRequired, 
	                                               commentController.create);
router.put('/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept', 		//para aceptar comentarios
	                                               sessionController.loginRequired, 
	                                               quizController.ownershipRequired, 
	                                               commentController.accept);

module.exports = router;
