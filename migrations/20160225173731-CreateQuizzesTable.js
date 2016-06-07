'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) { //la funcion up define como realizar los cambios en la BBDD
      return queryInterface.createTable(
           'Quizzes', 
           { id:        { type: Sequelize.INTEGER,  allowNull: false,
                          primaryKey: true,         autoIncrement: true,  
                          unique: true },
             question:  { type: Sequelize.STRING,
                          validate: { notEmpty: {msg: "Falta Pregunta"} } },
             answer:    { type: Sequelize.STRING,
                          validate: { notEmpty: {msg: "Falta Respuesta"} } },
             createdAt: { type: Sequelize.DATE,     allowNull: false },
             updatedAt: { type: Sequelize.DATE,     allowNull: false }
           },
           { sync: {force: true}  //indica que los cambios deben forzarse al arrancar la app si hay alguna incopatibilidad o error
           }
      );
  },
  down: function (queryInterface, Sequelize) {  //la funcion down define como deshacer los cambios en la BBDD
        return queryInterface.dropTable('Quizzes');
  }
};
