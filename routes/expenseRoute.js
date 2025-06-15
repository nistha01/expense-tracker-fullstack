const express= require('express');
const route=express.Router();

const expenseController= require('../controller/expenseController')

route.post('/get',expenseController.getExpenseOfUser);
route.post('/addExpense',expenseController.addExpense)



module.exports=route;