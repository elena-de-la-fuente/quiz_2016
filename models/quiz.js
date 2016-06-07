
// Definicion del modelo Quiz:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',	//Quiz: objeto que implementa el acceso ORM al a tabla 
                          { question: { type: DataTypes.STRING,
                          	            validate: { notEmpty: {msg: "Falta Pregunta"}}	//el modelo comprueba q se cumplen las funciones de validación, siempre q
                          	          },												//se va a crear, actualizar o guardar algo en la base de datos.
                            answer:   { type: DataTypes.STRING,							//Lanza error si la validacion no se cumple, se captura con catch en quiz_controllers
                                        validate: { notEmpty: {msg: "Falta Respuesta"}}
                                      }
                          });
};
