//==========================Bắt sự kiện khi nào thì làm hoạt động action hiển thị extension======================  
//Bắt sự kiện Click hoặc là keyup để thực hiện action và hiển thị nút extension
document.addEventListener("click", action, false);

document.addEventListener(
    "keyup",
    () => {
        action();
    },
    false
);

//================================================================ 


//==========================Kiểm tra điều kiện để hiển thị icon và thực hiện add Icon======================
// Kiểm tra đầu vào là input hay là textarea 
function checkInput(clickedElement) {
    return (
        (clickedElement.tagName == "INPUT" &&
            (clickedElement.type == "text" || clickedElement.type == "search")) ||
        clickedElement.tagName == "TEXTAREA" ||
        clickedElement.role == "textbox"
    );
}

// Bắt sự kiện lắng nghe ở trên để hiện thì 
function action() {
    var clickedElement = document.activeElement;
    // console.log("Hello");

    // Kiểm tra đầu vào để nếu đúng thì mới addIcon vào cái vùng Clicked được, còn nếu không thì tìm vùng chỗ
    // có trong bodey mà remove
    if (checkInput(clickedElement)) {
        addIconToClickedField(clickedElement);
    }
}
//================================================================ 


//==========================Các hàm add Icon====================== 
//Hàm add icon
function addIconToClickedField(clickedElement) {
    var icon = createIcon();

    var existingIcon = document.querySelector(".icon");
    var divContainer = document.getElementById("file-container");
    clickedElement.parentNode.style.position = "relative";
    const compStyles = getComputedStyle(clickedElement);
    const parentStyles = getComputedStyle(clickedElement.parentNode);

    // Điều kiện if này là nếu có 2+ ô input trở lên thì xóa icon ở ô input cũ và hiển thị ở ô mới
    //xóa luôn cả file-container
    if (existingIcon) {
        existingIcon.parentNode.removeChild(existingIcon);
        divContainer.parentNode.removeChild(divContainer);
    }

    // set position
    icon.style.position = "absolute";
    icon.style.top = `${(clickedElement.offsetTop
        + parseFloat(compStyles.paddingBottom)
        + parseFloat(compStyles.borderBottom))}px`;
    //icon.style.top = compStyles.paddingTop;
    icon.style.right = `${clickedElement.parentNode.offsetWidth +
        parseFloat(compStyles.paddingRight) +
        parseFloat(compStyles.borderRight) -
        clickedElement.offsetLeft -
        clickedElement.offsetWidth
        }px`;

    clickedElement.parentNode.appendChild(icon);

    var container = createContainer();
    document.body.appendChild(container);
    //clickedElement.parentNode.insertBefore(container, clickedElement.nextSibling);

    // createPopup();
    // openCustomPopup();

    var img = createImg();
    icon.appendChild(img);

    // Thêm sự kiện click cho icon để hiển thị popup
    icon.addEventListener("click", function () {
        toggleFileVisibility(clickedElement); // Gọi hàm hiển thị popup khi icon được click
    });
}
//Hàm tạo Container de bao bọc bên ngoài popup_func chon chuc nang
function createContainer() {
    var container = document.createElement("div");
    container.id = "file-container"; // Add classes or styles for your icon
    // container.style.display = "block";
    container.style.position = "fixed"
    container.style.zIndex = "777777";
    return container;
}
//Hàm khởi tạo hình ảnh số 6-> Team 6 để chứa trong icon
function createImg() {
    var img = document.createElement("img");
    img.src = "https://cdn-icons-png.flaticon.com/512/6913/6913644.png";
    img.alt = "...";
    img.style.height = "18px";
    img.style.width = "18px";
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    return img;
}
//Hàm khởi tạo nút button bên ngoài để chứa số 6 tạo ra từ hàm createImg ở trên
function createIcon() {
    var icon = document.createElement("button");
    icon.className = "icon"; // Add classes or styles for your icon
    icon.style.width = "20px";
    icon.style.height = "20px";
    icon.style.zIndex = "666666";
    return icon;
}
//================================================================ 


//==================Các hàm thực hiện khi click vào icon thì hiển thị ra bảng để tương tác vs user===========
//Hàm hiển thị chính của toggle hiển thị
var isFileVisible = false;
function toggleFileVisibility(clickedElement) {
    createPopup(clickedElement);
    const fileContainer = document.getElementById("file-container");
    //console.log(fileContainer);
}
// Hàm để thiết lập nội dung cho popup
function createPopup(clickedElement) {
    //console.log("Batdau");
    fetch(chrome.runtime.getURL("popup_func/popup_func.html"))
        .then((response) => response.text())
        .then((data) => {
            setPopupContent(data, clickedElement);
        })
        .catch((error) => {
            console.error("Failed to fetch popup HTML:", error);
        });

    //console.log("aaaaaaaaaaaaaaaaa");
}
function setPopupContent(data, clickedElement) {
    const fileContainer = document.getElementById("file-container");
    //Khúc chèn nội dung vào file-container
    fileContainer.innerHTML = data;
    // Gán kích thước của div bằng kích thước tối đa của nội dung bên trong
    const popupFunc = fileContainer.querySelector("#popup-func");
    popupFunc.style.position = "absolute";
    // Gán chiều rộng thẻ container bằng thèn con lớn nhất
    const rect = popupFunc.getBoundingClientRect();
    fileContainer.style.width = `${rect.width}px`;
    fileContainer.style.height = `${rect.height}px`;

    //Set vị trí cho thẻ container bao ngoài
    const parentClickElementRect = clickedElement.parentNode.getBoundingClientRect();
    const top = parentClickElementRect.top + parentClickElementRect.height;
    const left = parentClickElementRect.left + parentClickElementRect.width;
    fileContainer.style.top = `${top}px`;
    fileContainer.style.left = `${left}px`;
    // Gọi hàm setRelativePosition mỗi khi cửa sổ được cuộn hoặc thay đổi kích thước
    window.addEventListener('scroll', () => {
        //Set vị trí cho thẻ container bao ngoài
        const parentClickElementRect = clickedElement.parentNode.getBoundingClientRect();
        const top = parentClickElementRect.top + parentClickElementRect.height;
        const left = parentClickElementRect.left + parentClickElementRect.width;
        fileContainer.style.top = `${top}px`;
        fileContainer.style.left = `${left}px`;
    });
    window.addEventListener('resize', () => {
        //Set vị trí cho thẻ container bao ngoài
        const parentClickElementRect = clickedElement.parentNode.getBoundingClientRect();
        const top = parentClickElementRect.top + parentClickElementRect.height;
        const left = parentClickElementRect.left + parentClickElementRect.width;
        fileContainer.style.top = `${top}px`;
        fileContainer.style.left = `${left}px`;
    });

    const icons = setIconUrls();

    document.getElementById("icon").src = icons["icon-32"];
    document.getElementById("icon-x").src = icons["icon-x"];
    document.getElementById("icon-translate").src = icons["icon-translate"];
    document.getElementById("icon-revise").src = icons["icon-revise"];
    document.getElementById("icon-summarize").src = icons["icon-summarize"];
    document.getElementById("icon-send").src = icons["icon-send"];



    //=======================Bắt sự kiện các click trong popup_func===================================
    //======== Bắt sự kiện nút icon-x
    const iconXElement = document.querySelector("#icon-x");
    iconXElement.addEventListener('click', () => {
        fileContainer.parentNode.removeChild(fileContainer);
    })

    //================================================================ 

}
// Tạo hàm để thiết lập URL của hình ảnh
function setIconUrls() {
    const iconUrls = [
        "icon-32.png",
        "icon-x.png",
        "icon-translate.png",
        "icon-revise.png",
        "icon-summarize.png",
        "icon-send.png",
    ];

    const iconUrlsMap = {};

    iconUrls.forEach((icon) => {
        const iconName = icon.replace(/\.png$/, ""); // Loại bỏ phần mở rộng của tên file
        iconUrlsMap[iconName] = chrome.runtime.getURL(`img/${icon}`);
    });

    return iconUrlsMap;
}
//================================================================







// const token="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"
// const abc=document.querySelector("quy")
// fetch('https://api.openai.com/v1/chat/completions',{
//     method: 'POST',
//     headers:{
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer '+token,
//     },
//     body: JSON.stringify({
//         "model": "gpt-3.5-turbo",
//         "messages": [{"role": "user","content":"Dịch sang tiếng anh: Xin chào Sa"}]
//     })
// }).then(response =>{
//     return response.json();
// }).then(data => {
//     //abc.innertText=data.choices[0].message.content;
//     console.log(data.choices[0].message.content)
// })
// //https://youtu.be/SnV2fkAawrc?si=1coB_fwx_t1U5RHz