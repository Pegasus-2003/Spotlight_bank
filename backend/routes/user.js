const express= require('express');
const connection = require('../connection');
const router = express.Router();
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole =require('../services/checkRole');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var todayDate = new Date().toISOString().slice(0, 10);

const next10 =()=>{
  const first = todayDate.substring(0,2);
  const second = parseInt(todayDate[2])+1;
  const third = todayDate.substring(3,10);
  const fourth = first + second + third;
  return fourth;
}

const getdig10 = () => {
    const val1 = Math.floor(1000 + Math.random() * 9000).toString();
    const val2 = Math.floor(1000 + Math.random() * 9000).toString();
    const val3 = Math.floor(1000 + Math.random() * 9000).toString();
    const val4 = Math.floor(1000 + Math.random() * 9000).toString();
    var candidate = val1+val2+val3+val4;
    candidate=candidate.substring(0,10);
    candidate = parseInt(candidate);
    query = "select * from customer where accountNumber=?";
    connection.query(query,[candidate],(err,results)=>{
      if(results.length > 0){
         return getdig10();
      }
    })
    return candidate;
}
const getdig3 = () => {
  const val1 = Math.floor(1000 + Math.random() * 9000).toString();
  const val2 = Math.floor(1000 + Math.random() * 9000).toString();
  var candidate = +val1+val2;
  candidate=candidate.substring(0,3);
  return parseInt(candidate);
}
const getstr16 = () => {
  const val1 = Math.floor(1000 + Math.random() * 9000).toString();
  const val2 = Math.floor(1000 + Math.random() * 9000).toString();
  const val3 = Math.floor(1000 + Math.random() * 9000).toString();
  const val4 = Math.floor(1000 + Math.random() * 9000).toString();
  const val5 = Math.floor(1000 + Math.random() * 9000).toString();
  const val6 = Math.floor(1000 + Math.random() * 9000).toString();
  const val7 = Math.floor(1000 + Math.random() * 9000).toString();
  var candidate = +val1+val2+val3+val4+val5+val6+val7;
  candidate=candidate.substring(0,16);
  query = "select * from cards where cardNumber=?";
    connection.query(query,[candidate],(err,results)=>{
      if(results.length > 0){
         return getstr16();
      }
    })
    return candidate;
}



router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
router.post('/signup',(req,res)=>{
  let user = req.body;
  console.log(req.body);
  query ="select accountNumber,name,email,password from customer where email=?"
  connection.query(query,[user.email],(err,results)=>{
    if(!err){
      if (results.length<=0){
        var accgen = getdig10();
        var query="insert into customer(accountNumber,name,contactNumber,email,password,status,role) values("+accgen+",?,?,?,?,'false','user') ";
        var query1="insert into dashboard(accountNumber,balance) values("+accgen+",10000)";
        var query3="insert into transaction(accountNumber,transtype,fromacc,toacc,amount,dateo,description) values("+accgen+",'credit','Admin',?,'0','"+todayDate+"','initial')";
        var query4="insert into transaction(accountNumber,transtype,fromacc,toacc,amount,dateo,description) values("+accgen+",'debit',?,'Admin','0','"+todayDate+"','initial')";
        var query2="insert into cards(accountNumber,cardName,cardNumber,cvv,issuedDate,expiryDate,cardStatus) values("+accgen+",?,"+getstr16()+","+getdig3()+",'"+todayDate+"','"+next10()+"','active')";
        connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results)=>{
          if(err) throw err;
        });
        connection.query(query1,[],(err,resuts)=>{
          if(err) throw err;
        }); 
        connection.query(query3,[user.name],(err,results)=>{
            if(err) throw err;
        });
        connection.query(query4,[user.name],(err,results)=>{
          if(err) throw err;
        });
        connection.query(query2,[user.name],(er,results)=>{
          if(!err){
            return res.status(200).json({message:"Successfully registered"});
          }
          else{
            return res.status(500).json(err);
          }
        });       
      }
      else{
        return res.status(400).json({message :"Email already Exists"});
      }
    }
    else{
      return res.status(500).json(err);
    }
  });
});

router.post('/login',(req,res)=>{
  const user = req.body;
  query ="select accountNumber,name,email,password,status,role from customer where email=?"
  connection.query(query,[user.email],(err,results)=>{
    if(!err){
      if(results.length <=0 || results[0].password!= user.password ){
        return res.status(401).json({message: "Invalid Username or password"});
      }
      else if(results[0].status==='false'){
        return res.status(402).json({message:"wait for admin"});
      }
      else if(results[0].password == user.password){
        const response ={email :results[0]};
        const accesToken=jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'});
        return res.status(200).json({token:accesToken});
      }
      else{
        return res.status(400).json({message:"something went wrong"});
      }
    }
  });
});

router.post('/adminlogin',(req,res)=>{
  const user = req.body;
  query ="select accountNumber,name,email,password,status,role from customer where email=?"
  connection.query(query,[user.email],(err,results)=>{
    if(!err){
      if(results.length <=0 || results[0].password!= user.password ){
        return res.status(401).json({message: "Invalid Username or password"});
      }
      else if(results[0].role==='user'){
        return res.status(402).json({message:"Not an admin"});
      }
      else if(results[0].password == user.password){
        const response ={email :results[0]};
        const accesToken=jwt.sign(response,process.env.ACCESS_TOKEN,{expiresIn:'8h'});
        return res.status(200).json({token:accesToken});
      }
      else{
        return res.status(400).json({message:"something went wrong"});
      }
    }
  });
});

router.post('/adminDash',(req,res)=>{
  const user = req.body;
  query ="SELECT * FROM customer JOIN dashboard ON customer.accountNumber = dashboard.accountNumber where role='user'";
  connection.query(query,[],(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  })
});

router.post('/transfer',(req,res)=>{
  const user = req.body;
  query ="select * from customer where accountNumber=?"
  connection.query(query,[user.accountNumber],(err,results)=>{
    
    if(!err){
      if(results.length <=0 || results[0].accountNumber!= user.accountNumber ){
        return res.status(401).json({message: "Invalid Account Number "});
      }
      else if(results[0].accountNumber == user.accountNumber){
        const toaccname = results[0].name;
        query1="update dashboard set balance=balance + " + user.amount +" where accountNumber=?";
        query2="update dashboard set balance=balance - " + user.amount +" where accountNumber=?";
        query3="insert into transaction(accountNumber,transtype,fromacc,toacc,amount,dateo,description) values(?,'credit',?,?,?,?,?)"; 
        query4="insert into transaction(accountNumber,transtype,fromacc,toacc,amount,dateo,description) values(?,'debit',?,?,?,?,?)";
        connection.query(query1,[user.accountNumber],(err,results) =>{
          if(err) throw err;
          connection.query(query2,[user.fromAccountNumber],(err,results) =>{
            if(err) throw err;
            connection.query(query3,[user.accountNumber,user.fromname,toaccname,user.amount,todayDate,user.description],(err,results)=>{
              if(err) throw err;
              connection.query(query4,[user.fromAccountNumber,user.fromname,toaccname,user.amount,todayDate,user.description],(err,results)=>{
                if(err) throw err;
              });
            });
          });
        });
        return res.status(200).json({message:"sucessful"})
      }
      else{
        return res.status(400).json({message:"something went wrong"});
      }
    }
    else{
      return res.status(500).json(err);
    }
  });
});
router.post('/dashboard',(req,res)=>{
  const user=req.body;
  query1="SELECT * FROM customer JOIN transaction ON customer.accountNumber = transaction.accountNumber JOIN cards ON customer.accountNumber = cards.accountNumber JOIN dashboard ON customer.accountNumber=dashboard.accountNumber WHERE customer.email = ?"
  connection.query(query1,[user.email],(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  })
});

router.post('/transactionHistory',(req,res)=>{
  const user=req.body;
  query1="SELECT * FROM customer JOIN transaction ON customer.accountNumber = transaction.accountNumber where email=?"
  connection.query(query1,[user.email],(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  })
});


router.post('/creditthisMonth',(req,res)=>{
  const user=req.body;
  query1="SELECT SUM(amount) as creditsum FROM customer JOIN transaction ON customer.accountNumber = transaction.accountNumber WHERE email =? and transtype='credit' and   dateo >= DATE(NOW()) - INTERVAL 30 DAY"
  connection.query(query1,[user.email],(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  })
});
router.post('/debitthisMonth',(req,res)=>{
  const user=req.body;
  query1="SELECT SUM(amount) as debitsum FROM customer JOIN transaction ON customer.accountNumber = transaction.accountNumber WHERE email =? and transtype='debit' and   dateo >= DATE(NOW()) - INTERVAL 30 DAY"
  connection.query(query1,[user.email],(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  })
});



var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
      user: "spotlightbankbng@gmail.com",
      pass: "xrnueuxsynronkwp"
  }
});

router.post('/forgotPassword',(req,res)=>{
  const user=req.body;
  query= "select email,password from customer where email=?";
  connection.query(query,[user.email],(err,results)=>{
    if(!err){
      if(results.length <=0){
        return res.status(400).json({message:"Email Does not Exist"});
      }
      else{
        var mailOptions={
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "Password by-SPOTLIGHT",
          html:"<p><b>Your Login Details for SPOTLIGHT</b><br><b>EMAIL:</b>"+results[0].email+"<br><b>PASSWORD</b>"+results[0].password+"</p>"
        };
        transporter.sendMail(mailOptions,function(err,info){
          if(err){
            console.log("Error");
          }
          else{
            console.log("email sent" + info.response);
          }
        });
        return res.status(200).json({message:"Password sent successfully to your email"});
      }
    }
    else{
      return res.status(500).json(err);
    }
  });
});

router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
  var query= "select accountNumber,name,email,password,status from customer ";
  connection.query(query,(err,results)=>{
    if(!err){
      return res.status(200).json(results);
    }
    else{
      return res.status(500).json(err);
    }
  });
});


router.post('/update',(req,res)=>{
  let user = req.body;
  var query= "update customer set "+user.field+"=? where accountNumber=?";
  connection.query(query,[user.tovalue,user.accountNumber],(err,results)=>{
    if(!err){
      if(results.affectedRows == 0){
        return res.status(404).json({message:"user id does not exist"});
      }
      return res.status(200).json({message: " user updated succesfully"});

    }
    else{
      console.log(err);
      return res.status(500).json(err);
    }
  });
});

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
  return res.status(200).json({message: "true"});
});

router.post('/changePassword',auth.authenticateToken,(req,res)=>{
  const user = req.body;
  const email = res.locals.email;
  var query="select accountNumber,password,email,status from customer where email=? and password=?";
  console.log("1234");
  connection.query(query,[email,user.oldPassword],(err,results)=>{
    if(!err){
      if(results.length<=0){
        return res.status(400).json({message:"Incorrect old Password"});
      }
      else if(results[0].Password == user.oldPassword){
        query = "update customer set password=? where email=?";
        connection.query(query, [user.newPassword,email],(err,results)=>{
          if(!err){
            return res.status(200).json({message: "Password updated succesfully"});
          }
          else{
            return res.status(500).json(err);
            console.log("here");
          }
        })
      }
      else{
        return res.status(400).json({message:"something went wrong"})
      }
    }
    else{
      return res.status(500).json(err);
      console.log("there");
    }
  })
});

module.exports = router;
