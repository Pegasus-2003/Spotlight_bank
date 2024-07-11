var statusCode=0;
var email=document.getElementById("email").value;
var password=document.getElementById("password").value;
const Login= async ()=>{
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }),
    }
    localStorage.setItem("emailid",document.getElementById("email").value)
    

    let p = await fetch( 'http://localhost:8080/user/adminlogin', options)
        let response = await p.json()
        statusCode=p.status;
        return response
}



document.getElementById("login").onclick = async () =>{
    let result= await Login();
    if(statusCode==200){
        window.location="admin.html"
    }
    else if(statusCode==402){
        document.getElementById("popupwait").classList.add("open-popup");
    }
    else if(statusCode==401){
        document.getElementById("popupinvalid").classList.add("open-popup");
    }
    else{
        document.getElementById("popupwrong").classList.add("open-popup");
    }
};

okButton=document.getElementById("okbuttonwait");
okButton.onclick=function(){
    document.getElementById("popupwait").classList.remove("open-popup");
    window.location="adminlogin.html";
}

okButton1=document.getElementById("okbuttoninvalid");
okButton1.onclick=function(){
    document.getElementById("popupinvalid").classList.remove("open-popup");
    window.location="adminlogin.html";
}
okButton2=document.getElementById("okbuttonwrong");
okButton2.onclick=function(){
    document.getElementById("popupwrong").classList.remove("open-popup");
    window.location="adminlogin.html";
}
