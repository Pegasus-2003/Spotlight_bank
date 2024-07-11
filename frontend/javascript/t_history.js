const emailid=localStorage.getItem("emailid");
var resultobj;
var creditthismonth;
var statusCode;
var debitthismonth;
var transactionobj;
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
        
        
        statusCode=p.status;
        return response1
}
transactionHistory();