console.log("Running extension......", chrome)
const bodyDOM = document.querySelector('body')
// bodyDOM.addEventListener("keydown", (e) => {
//     const activeTextarea = document.activeElement;
//     // Xử lí hiện cái icon


//     //Khi nhấn dô icon
//     if (e.key === 'Tab') {
//         const myString = activeTextarea.value
//         console.log(activeTextarea)
//     }
// })
bodyDOM.addEventListener("mouseup", () => {
    const activeTextarea = document.activeElement;
    // Xử lí hiện cái icon
    renderIconExtension(activeTextarea);
    //Khi nhấn dô icon
    //icon.addListenner("moseup",()=>{
    // const myString = activeTextarea.value
    // console.log(activeTextarea)
    //})
})

function renderIconExtension(activeTextarea) {
    //
    const toolTipWrapper = document.createElement("div");
    toolTipWrapper.id = "iconWrapper";
    const toolTipIcon = document.createElement("div");
    toolTipIcon.classList.add("class-icon");
    toolTipIcon.innerHTML = `<svg width="20px" height="20px"><img src="https://cdn-icons-png.flaticon.com/512/6335/6335609.png" alt="..." style="heigth:20px;width:20px"></svg>`
    toolTipWrapper.appendChild(toolTipIcon);
    //Set vị trí cho tooTipWrapper
    const activeTextareaRect = activeTextarea.getBoundingClientRect();
    const positionY=(activeTextareaRect.height-20)/2+activeTextareaRect.top;
    const positionX=activeTextareaRect.right;
    
    toolTipWrapper.style.position = 'absolute';
    toolTipWrapper.style.top = `${positionY}px`;
    toolTipWrapper.style.left = `${positionX}px`;
    bodyDOM.appendChild(toolTipWrapper);


}




