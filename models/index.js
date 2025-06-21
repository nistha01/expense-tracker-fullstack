const user= require('./UserModel');
const expense= require('./expenseModel');
const order = require('./order');


user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(order, { foreignKey: 'email' });
order.belongsTo(user, { foreignKey: 'email' });




module.exports={user,expense,order}