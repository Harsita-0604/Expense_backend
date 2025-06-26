const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
require('dotenv').config();
const PORT = 4000
const MONGO_URI="mongodb+srv://harsitasrinivasen:expense@cluster0.5her5w1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const cors = require('cors');
app.use(cors());
//app.use(express.urlencoded({extended : true}))
// const MONGO_URI = 'mongodb://localhost:27017/ExpenseTracker'
const expenseSchema = new mongoose.Schema({     //required data are in form of schema
    title:{ 
        type:String , 
        required:true
    },
    amount:{
        type:Number , 
        required:true
    }
})
const Expense = mongoose.model('Expense',expenseSchema)
mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("Connected to mongoDb")
})
.catch((err)=>{
    console.log('mongoDb connection error :',err)
})
app.post('/Expense' , async(req,res)=>{
    try {
        const{title,amount} = req.body; //postman la irukaruthu db ku pass aga 
        const expense = new Expense({title,amount})
        await expense.save();
        res.status(201).json(expense)
    } catch (error) {
        console.error('Error saving expense',error)
        res.status(500).json({error:"faileed to save"})
    }
})

app.get('/Expense',async (req,res)=>{ //try catch iruntha process stop panama error a display pannum
    try{
        const expenses=await Expense.find();
        res.json(expenses)
    }catch(error){
        console.error('Error getting expense',error)
        res.status(500).json({error:"failed to save"})

    }
})

app.delete('/Expense/:userID' , async(req,res) =>{
try {
    const {userID} = req.params;
    const deleteExpense = await Expense.findByIdAndDelete(userID)
 if(!deleteExpense){
    return res.status(404).json({error:"not found"});
 }
 res.status(201).json({message : "Data deleted", deleteExpense})
} catch (error) {
    console.error('error deleting expense',error)
    res.status(500).json({error : 'failed to delete'})
}
})
app.listen(PORT,()=>{
    console.log(`server is listening on port ${PORT}`)
    
})
