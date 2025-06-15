const user= require('./UserModel');
const expense= require('./expenseModel');


user.hasMany(expense);
expense.belongsTo(user);




module.exports={user,expense}