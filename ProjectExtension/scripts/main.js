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
            (clickedElement.type == "text" || clickedElement.type == "search" || clickedElement.type == "email")) ||
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
    // icon.style.zIndex = compStyles.zIndex + 1;
    icon.style.zIndex = "6666";
    clickedElement.parentNode.appendChild(icon);

    var container = createContainer();
    //document.body.appendChild(container);
    clickedElement.parentNode.appendChild(container);

    // createPopup();
    // openCustomPopup();

    var img = createImg();
    icon.appendChild(img);

    // Thêm sự kiện click cho icon để hiển thị popup
    icon.addEventListener("click", function () {
        toggleFileVisibility(icon); // Gọi hàm hiển thị popup khi icon được click
    });
}


//Hàm tạo Container de bao bọc bên ngoài popup_func chon chuc nang
function createContainer() {
    var container = document.createElement("div");
    container.id = "file-container"; // Add classes or styles for your icon
    // container.style.display = "block";
    container.style.position = "fixed";
    container.style.zIndex="7777"
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
    icon.type = "button";
    return icon;
}
//================================================================ 


//==================Các hàm thực hiện khi click vào icon thì hiển thị ra bảng để tương tác vs user và ẩn bảng===========
//Hàm hiển thị file-container
function toggleFileVisibility(icon) {
    const fileContainer=document.querySelector("#file-container");
    if(fileContainer.textContent==''){
        createInnerContainer(icon);
    }else{
        fileContainer.style.display="block";
    }
}

// Ẩn File-Container để lúc sau cần thì chỉ cần chuyển sang dạng block để hiển thị lại, k cần phải tạo mới
function hideFileContainer(){
    document.querySelector("#file-container").style.display="none";
}


// Hàm để thiết lập nội dung cho file-container
function createInnerContainer(icon) {
    //console.log("Batdau");
    fetch(chrome.runtime.getURL("popup_func/popup_func.html"))
        .then((response) => response.text())
        .then((data) => {
            setInnerContainerContent(data, icon);
        })
        .catch((error) => {
            console.error("Failed to fetch popup HTML:", error);
        });

    //console.log("aaaaaaaaaaaaaaaaa");
}
function setInnerContainerContent(data, icon) {
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
    // fileContainer.style.zIndex = getComputedStyle(icon).zIndex + 1;

    //set vị trí cho file-container
    setPositionForFileContainer(fileContainer,icon,rect);
    // Gọi hàm setRelativePosition mỗi khi cửa sổ được cuộn hoặc thay đổi kích thước
    window.addEventListener('scroll', () => {
        setPositionForFileContainer(fileContainer,icon,rect);
    });
    window.addEventListener('resize', () => {
        setPositionForFileContainer(fileContainer,icon,rect);
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
        hideFileContainer();

    })
    //================================================================ 
}

//set Vị trí cho file-container
function setPositionForFileContainer(fileContainer,icon,rect){
        //Set vị trí cho thẻ container bao ngoài
        const iconRect = icon.getBoundingClientRect();
        const top = iconRect.top + iconRect.height;
        const left = iconRect.left + iconRect.width;
        if (top + rect.height <= window.innerHeight) {
            fileContainer.style.top = `${top+5}px`;
        }
        else {
            fileContainer.style.top = `${iconRect.top - rect.height-5}px`;
        }
        if (left + rect.width <= window.innerWidth) {
            fileContainer.style.left = `${left}px`;
        }
        else {
            fileContainer.style.left = `${window.innerWidth - rect.width}px`
        }
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