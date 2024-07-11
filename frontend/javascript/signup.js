var statusCode=0;
const signUp= async ()=>{
    console.log("into signup");
    let options = {
        method: "POST",
        mode: 'cors',
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            contactNumber: document.getElementById("contact").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }),
    }
    let p = await fetch( 'http://localhost:8080/user/signup', options)
        let response = await p.json()
        statusCode=p.status;
        return response
}
document.getElementById("login").onclick = async () =>{
    let result= await signUp();
    if(statusCode==200){
        document.getElementById("popup").classList.add("open-popup");
    }
    else if(statusCode==400){
        document.getElementById("popupexist").classList.add("open-popup");
    }
    else{
        document.getElementById("popupwrong").classList.add("open-popup");
    }
    console.log(result.status);
};

okButton=document.getElementById("okbutton");
okButton.onclick=function(){
    document.getElementById("popup").classList.remove("open-popup");
    window.location="index.html";
}

okButton1=document.getElementById("okbutton1");
okButton1.onclick=function(){
    document.getElementById("popupexist").classList.remove("open-popup");
    window.location="index.html";
}
okButton2=document.getElementById("okbutton2");
okButton2.onclick=function(){
    document.getElementById("popupwrong").classList.remove("open-popup");
    window.location="index.html";
}
