const emailid=localStorage.getItem("emailid");
var adminobj;
var statusCode;
const adminDash = async ()=>{
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

    let p = await fetch( 'http://localhost:8080/user/adminDash', options)
        let response1 = await p.json()
        adminobj=response1;
        var mainObj=adminobj;
        var k = '<tbody>'
            for(i = mainObj.length-1 ;i >=0; i--){
                k+= '<tr>';
                k+= '<td>' + mainObj[i].accountNumber + '</td>';
                k+= '<td>' + mainObj[i].name + '</td>';
                k+= '<td>' + mainObj[i].contactNumber + '</td>';
                k+= '<td>' + mainObj[i].email + '</td>';
                k+= '<td>' + mainObj[i].password + '</td>';
                k+= '<td>' + mainObj[i].balance + '</td>';
                k+= '<td>' + mainObj[i].status + '</td>';
                k+= '<td class="update-head"><button class="btn update-btn" onclick=window.location.href="update.html" > UPDATE </button></td>';
                k+= '</tr>';
            }
            k+='</tbody>';
            document.getElementById('tableData').innerHTML = k;
        statusCode=p.status;
        return response1
}

adminDash();

