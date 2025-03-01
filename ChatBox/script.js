let prompt =document.querySelector("#prompt");
let chatContainer =document.querySelector(".chat-container");
let imgButton =document.querySelector("#image");
let imgInput =document.querySelector("#image input");
let image =document.querySelector("#image img");
let submitButton = document.querySelector("#submit"); // Get submit button

const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDwj63UXNzpzCTN5fE9iOfBjRpB8PbgjEo";

let user = {
    conv: null,
    file: {
        mime_type: null,
        data: null
    }
};


prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && prompt.value.trim() !== "") {  
        e.preventDefault(); 
        submitButton.click(); 
    }
});


submitButton.addEventListener("click", () => {
    if (prompt.value.trim() !== "") {  
        handleChatRespond(prompt.value);
    }
});
function createChatBox(html,classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatRespond(message) {
    user.conv = message;
    let html = `
        <img src="IMG/UserImage.png" alt="" id="userImage">
        <div class="user-chat-area">${user.conv}
        ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
        </div>
    `;
            prompt.value=""
    let useChatBox = createChatBox(html,"user-chat-box");
    chatContainer.appendChild(useChatBox);

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});

    setTimeout(()=>{
        let html = `<img src="IMG/aiImage.jpeg" alt="" id="aiImage">
            <div class="ai-chat-area"><img src="IMG/loading.gif" alt="" class="load" width="70px">
            </div>`;

            let aiChatBox = createChatBox(html,"ai-chat-box");
            chatContainer.appendChild(aiChatBox);

            generateResponse(aiChatBox);
    },600);
}

document.querySelectorAll(".chooseimg").forEach(img => {
    img.style.width = "400px";
    img.style.height = "200px";
    img.style.objectFit = "cover"; 
});


async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let requestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {text: user.conv},(user.file.data?[{"inline_data":user.file}]:[])
                    ]
                }
            ]
        })
        
    }

    try{
        let response = await fetch(apiUrl, requestOption);
        let data =await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
        text.innerHTML = apiResponse;
    }catch(error){
        console.log(error);
    }
    finally{
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
    }
}

prompt.addEventListener("keydown",(e)=>{
    if (e.key == "Enter") {
        handleChatRespond(prompt.value);
    }
})

imgInput.addEventListener("change",()=>{
    const file = imgInput.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload=(e)=>{
        let base64string = e.target.result.split(",")[1];
        user.file={
            mime_type:file.type,
            data:base64string
        }
    };
    reader.readAsDataURL(file)
});

imgButton.addEventListener("click",()=>{
    imgButton.querySelector("input").click();
});