const Expense= require('../models/expenseModel')
const User= require('../models/UserModel')

const getExpenseOfUser=async(req,res)=>{
    try{
        const {userEmail}=req.body;
        const expensesList = await Expense.findAll({
             where: { userEmail },
            order: [['date', 'DESC']], 
          });
          res.status(200).json(expensesList);
    }catch(e){
        res.status(500).send(e.message);
    }
}


const addExpense = async (req, res) => {
    try {
      const { amount, category, date, description, paymentMethod, userEmail } = req.body;
      const user = await User.findByPk(userEmail);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const newExpense = await user.createExpense({
        amount,
        category,
        date,
        description,
        paymentMethod
      });
  
      res.status(201).json(newExpense);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  const getMaxExpense= async(req,res)=>{
    try{
      const {email}= req.query;
     const allExpense = await Expense.findAll({
      where: { userEmail: email },
      attributes: ['amount']
    });
    const amountsArray = allExpense.map(exp => exp.amount);
    const maxExpense = amountsArray.length > 0 ? Math.max(...amountsArray) : 0;
      res.status(200).json(maxExpense);
    }catch(e){
      res.status(500).send(e.message);
    }
  }
    const getMinExpense= async(req,res)=>{
    try{
      const {email}= req.query;
     const allExpense = await Expense.findAll({
      where: { userEmail: email },
      attributes: ['amount']
    });
    const amountsArray = allExpense.map(exp => exp.amount);
    const maxExpense = amountsArray.length > 0 ? Math.min(...amountsArray) : 0;
      res.status(200).json(maxExpense);
    }catch(e){
      res.status(500).send(e.message);
    }
  }

module.exports={getExpenseOfUser,addExpense,getMaxExpense,getMinExpense}