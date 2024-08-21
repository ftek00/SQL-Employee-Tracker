const inquirer = require("inquirer");
const { Sequelize, DataTypes } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const Department = sequelize.define("Department", {
  name: DataTypes.STRING,
});

const Role = sequelize.define("Role", {
  title: DataTypes.STRING,
  salary: DataTypes.DECIMAL,
});

const Employee = sequelize.define("Employee", {
  name: DataTypes.STRING,
});

Department.hasMany(Role);
Role.belongsTo(Department);
Employee.belongsTo(Role);

const viewAllDepartments = async () => {
  const departments = await Department.findAll();
  console.table(departments);
};

const mainApp = async () => {
  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: ["View all departments", "View all roles", "Add a department"],
  });

  switch (action) {
    case "View all departments":
      await viewAllDepartments();
      break;
    case "View all roles":
      await viewAllRoles();
      break;
    case "Add a department":
      await addDepartment();
      break;

    default:
      console.log("Invalid choice. Please try again.");
  }
};

(async () => {
  await sequelize.sync({ alter: true });
  mainApp();
})();
