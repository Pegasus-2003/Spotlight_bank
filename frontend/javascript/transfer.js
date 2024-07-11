
const transfer= async ()=>{
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            accountNumber:document.getElementById("AccountNo").value,
            fromname:localStorage.getItem("accountName"),
            amount:document.getElementById("Amount").value,
            description:document.getElementById("transferDescription").value,
            fromAccountNumber:localStorage.getItem("accountNumber")
        }),
    }
    
    let p = await fetch( 'http://localhost:8080/user/transfer', options)
        let response = await p.json()
        resultobj=response;
        statusCode=p.status;
        return response
}
document.getElementById("payMoney").onclick = async()=>{
    if(parseInt(localStorage.getItem("balance"))<document.getElementById("Amount").value){
        document.getElementById("popupexceed").classList.add("open-popup")
    }
    else{
        let result = await transfer();
        if(statusCode==200){
            document.getElementById("popupwait").classList.add("open-popup");
        }
        else if(statusCode==401){
            document.getElementById("popupinvalid").classList.add("open-popup");
        }
        else{
            document.getElementById("popupwrong").classList.add("open-popup");
        }
    }
}
okButton=document.getElementById("okbuttonwait");
okButton.onclick=function(){
    document.getElementById("popupwait").classList.remove("open-popup");
    window.location="transfer.html";
}

okButton1=document.getElementById("okbuttoninvalid");
okButton1.onclick=function(){
    document.getElementById("popupinvalid").classList.remove("open-popup");
    window.location="transfer.html";
}
okButton2=document.getElementById("okbuttonwrong");
okButton2.onclick=function(){
    document.getElementById("popupwrong").classList.remove("open-popup");
    window.location="transfer.html";
}
okButton3=document.getElementById("okbuttonexceed");
okButton3.onclick=function(){
    document.getElementById("popupexceed").classList.remove("open-popup");
    window.location="transfer.html";
}
