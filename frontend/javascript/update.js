var resultobj;
var statusCode;
const update = async ()=>{
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            field: document.getElementById("Amount").value,
            accountNumber: document.getElementById("AccountNo").value,
            tovalue: document.getElementById("transferDescription").value
        })
    }

    let p = await fetch( 'http://localhost:8080/user/update', options)
        let response1 = await p.json()
        resultobj=response1;
        statusCode=p.status;
        return response1
}
document.getElementById("payMoney").onclick = async()=>{
    let result = await update();
    if(statusCode==200){
        document.getElementById("popupwait").classList.add("open-popup");
    }
    else if(statusCode==404){
        document.getElementById("popupinvalid").classList.add("open-popup");
    }
    else{
        document.getElementById("popupwrong").classList.add("open-popup");
    }
    
}
okButton=document.getElementById("okbuttonwait");
okButton.onclick=function(){
    document.getElementById("popupwait").classList.remove("open-popup");
    window.location="update.html";
}

okButton1=document.getElementById("okbuttoninvalid");
okButton1.onclick=function(){
    document.getElementById("popupinvalid").classList.remove("open-popup");
    window.location="update.html";
}
okButton2=document.getElementById("okbuttonwrong");
okButton2.onclick=function(){
    document.getElementById("popupwrong").classList.remove("open-popup");
    window.location="update.html";
}
