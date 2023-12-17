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
    } else {
        // Remove the icon if clicked elsewhere on the document
        var icon = document.querySelector(".icon");
        if (icon && icon == clickedElement.nextSibling) {
            icon.parentNode.removeChild(icon);
        }
    }
}
//================================================================ 


//==========================Các hàm add Icon====================== 
//Hàm add icon
function addIconToClickedField(clickedElement) {
    var icon = createIcon();
    var container = createContainer();

    var existingIcon = document.querySelector(".icon");
    clickedElement.parentNode.style.position = "relative";
    const compStyles = getComputedStyle(clickedElement);
    const parentStyles = getComputedStyle(clickedElement.parentNode);

    // Điều kiện if này là nếu có 2+ ô input trở lên thì xóa icon ở ô input cũ và hiển thị ở ô mới
    if (existingIcon) {
        existingIcon.parentNode.removeChild(existingIcon);
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
    clickedElement.parentNode.insertBefore(container, clickedElement.nextSibling);

    // createPopup();
    // openCustomPopup();

    var img = createImg();
    icon.appendChild(img);
}
//Hàm tạo Container de bao bọc bên ngoài popup_func chon chuc nang
function createContainer() {
    var container = document.createElement("div");
    container.id = "file-container"; // Add classes or styles for your icon
    container.style.display = "none";
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

    // Thêm sự kiện click cho icon để hiển thị popup
    icon.addEventListener("click", function () {
        toggleFileVisibility(); // Gọi hàm hiển thị popup khi icon được click
    });
    return icon;
}
//================================================================ 


//==================Các hàm thực hiện khi click vào icon thì hiển thị ra bảng để tương tác vs user===========
//Hàm hiển thị chính của toggle hiển thị
var isFileVisible = false;
function toggleFileVisibility() {
    createPopup();
    const fileContainer = document.getElementById("file-container");
    console.log(fileContainer);
    if (!isFileVisible) {
        // Nếu file không hiển thị, hiển thị nó
        fileContainer.style.display = "block";
        isFileVisible = true;
    } else {
        // Nếu file đang hiển thị, ẩn nó
        fileContainer.style.display = "none";
        isFileVisible = false;
    }
}
// Hàm để thiết lập nội dung cho popup
function createPopup() {
    document.addEventListener("click", () => {
        console.log("Batdau");
        fetch(chrome.runtime.getURL("popup_func/popup_func.html"))
            .then((response) => response.text())
            .then((data) => {
                setPopupContent(data);
            })
            .catch((error) => {
                console.error("Failed to fetch popup HTML:", error);
            });

        console.log("aaaaaaaaaaaaaaaaa");
    });
}
function setPopupContent(data) {
    const popup = document.getElementById("file-container");
    popup.innerHTML = data;

    const icons = setIconUrls();

    document.getElementById("icon").src = icons["icon-32"];
    document.getElementById("icon-x").src = icons["icon-x"];
    document.getElementById("icon-translate").src = icons["icon-translate"];
    document.getElementById("icon-revise").src = icons["icon-revise"];
    document.getElementById("icon-summarize").src = icons["icon-summarize"];
    document.getElementById("icon-send").src = icons["icon-send"];
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