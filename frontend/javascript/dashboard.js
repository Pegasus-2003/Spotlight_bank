
const emailid=localStorage.getItem("emailid");
var resultobj;
var creditthismonth;
var debitthismonth;
var transactionobj;
var accountNumberget;
const dashboard= async ()=>{
    console.log(emailid);
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailid
        }),
    }

    let p = await fetch( 'http://localhost:8080/user/dashboard', options)
        let response = await p.json()
        resultobj=response;
        accountNumberget=resultobj[0].accountNumber;
        localStorage.setItem("accountNumber",resultobj[0].accountNumber)
        localStorage.setItem("accountName",resultobj[0].name)
        localStorage.setItem("balance",resultobj[0].balance)
        document.getElementById("balanceSpan").innerHTML=resultobj[0].balance;
        statusCode=p.status;
        return response
}
const transactionHistory = async ()=>{
    console.log("into signup");
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailid
        }),
    }

    let p = await fetch( 'http://localhost:8080/user/transactionHistory', options)
        let response1 = await p.json()
        transactionobj=response1;
        var mainObj=transactionobj;
        var k = '<tbody>'
        if(mainObj.length<5){
            for(i = mainObj.length-1 ;i >= 0; i--){
                k+= '<tr>';
                k+= '<td>' + mainObj[i].transactionId + '</td>';
                k+= '<td>' + mainObj[i].fromacc + '</td>';
                k+= '<td>' + mainObj[i].toacc + '</td>';
                k+= '<td>' + mainObj[i].dateo.substring(0,10) + '</td>';
                k+= '<td>' + mainObj[i].amount + '</td>';
                k+= '<td>' + mainObj[i].description + '</td>';
                k+= '</tr>';
            }
            k+='</tbody>';
            document.getElementById('tableData').innerHTML = k;
        }
        else{
            for(i = mainObj.length-1 ;i >= mainObj.length-6 ; i--){
                k+= '<tr>';
                k+= '<td>' + mainObj[i].transactionId + '</td>';
                k+= '<td>' + mainObj[i].fromacc + '</td>';
                k+= '<td>' + mainObj[i].toacc + '</td>';
                k+= '<td>' + mainObj[i].dateo.substring(0,10) + '</td>';
                k+= '<td>' + mainObj[i].amount + '</td>';
                k+= '<td>' + mainObj[i].description + '</td>';
                k+= '</tr>';
            }
            k+='</tbody>';
            document.getElementById('tableData').innerHTML = k;
        }
        
        statusCode=p.status;
        return response1
}
const creditthisMonth= async ()=>{
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:emailid
        }),
    }

    let p = await fetch( 'http://localhost:8080/user/creditthisMonth', options)
        let response2 = await p.json()
        creditthismonth=response2;
        document.getElementById("creditspan").innerHTML=creditthismonth[0].creditsum;
        statusCode=p.status;
        return response2
}
const debitthisMonth= async ()=>{
    console.log(accountNumberget)
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email:emailid
        }),
    }

    let p = await fetch( 'http://localhost:8080/user/debitthisMonth', options)
        let response3= await p.json()
        debitthismonth=response3;
        document.getElementById("debitspan").innerHTML=debitthismonth[0].debitsum;
        statusCode=p.status;
        return response3
}


dashboard();
transactionHistory();
creditthisMonth();
debitthisMonth();


