
var models = require('../models');
var Sequelize = require('sequelize');


// Autoload el comentario asociado a :commentId
exports.load = function(req, res, next, commentId) {
  models.Comment.findById(commentId)
      .then(function(comment) {
          if (comment) {
            req.comment = comment;
            next();
          } else { 
            next(new Error('No existe commentId=' + commentId));
          }
        })
        .catch(function(error) { next(error); });
};


// GET /quizzes/:quizId/comments/new
exports.new = function(req, res, next) {        //nstancia el formulario de crear nueo comentario
  var comment = models.Comment.build({text: ""});

  res.render('comments/new', { comment: comment, 
  	                           quiz: req.quiz
  	                         });
};


// POST /quizes/:quizId/comments
exports.create = function(req, res, next) {
  var comment = models.Comment.build(
      { text:   req.body.comment.text,          
        QuizId: req.quiz.id,            //comment.belongTo(Quiz) añade el campo QuizId en la tabla comment para asociar el comentario al quizasociado a traves de la relacion
        AuthorId: req.session.user.id
      });

  comment.save()
    .then(function(comment) {
      req.flash('success', 'Comentario creado con éxito.');
      res.redirect('/quizzes/' + req.quiz.id);    //me redirecciona a quizees/1 por ejemplo, pregnta donde he creado el comentario
    }) 
	  .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('comments/new', { comment: comment,
      	                           quiz:    req.quiz});
    })
    .catch(function(error) {
      req.flash('error', 'Error al crear un Comentario: '+error.message);
		  next(error);
	  });    
};


// GET /quizzes/:quizId/comments/:commentId/accept
exports.accept = function(req, res, next) {

  req.comment.accepted = true;    //necesita autoload porque el comentario es de una pregunta en concreto

  req.comment.save(["accepted"])
    .then(function(comment) {
      req.flash('success', 'Comentario aceptado con éxito.');
      res.redirect('/quizzes/'+req.params.quizId);
    })
    .catch(function(error) {
       req.flash('error', 'Error al aceptar un Comentario: '+error.message);
       next(error);
    });
  };

