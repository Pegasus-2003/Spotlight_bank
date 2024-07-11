const express=require('express');
const connection = require('../connection');
require('dotenv').config();
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
  let transaction=req.body;
  query="insert into transaction (accountNumber) values(?)";
  connection.query(query,[transaction.accountNumber],(err,results)=>{
    if(!err){
      return res.status(200).json({message: "transaction added succesfully"});
    }
    else{
      return res.status(500).json(err);
    }
  })
});

router.get('/get',auth.authenticateToken,(req,res,next)=>{
  var query= "select * from transaction order by accountNumber";
  connection.query(query,(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  });
});

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
  let product = req.body;
  var query = "update transaction set name=? where id=?";
  connection.query(query,[product.name,product.id],(err,results)=>{
    if(!err){
      if(results.affectedRows==0){
        return res.status(400).json({message:"transaction id does not exist"});
      }
      else{
        return res.status(200).json({message:"transaction updated succesfully"});
      }
    }
    else{
      return res.status(500).json(err);
    }
  });
});


module.exports = router;
