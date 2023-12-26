/*1.====================================================================== 
            BẮT SỰ KIỆN KHI NÀO HIỂN THỊ ICON
    ====================================================================== 
*/


//Bắt sự kiện Click hoặc là keyup để thực hiện action và hiển thị nút extension
// Biến này để giữ lại biến mà chúng ta click vào để mà khi chúng ta bấm ra vị trí trống bấm vô lại vẫn có được vị trí đó.
var editableElement;

document.addEventListener("click", action, false);

document.addEventListener(
    "keyup",
    () => {
        action();
    },
    false
);



//1.========================Kết thúc bắt sự kiện action======================================== 





/*2.======================================================================
        KIỂM TRA ĐIỀU KIỆN ĐỂ HIỂN THỊ ICON VÀ GỌI HÀM ADD ICON
======================================================================
*/


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
    //Cần kiểm tra điều kiện khác chỗ này vì khi chat với AI thì thẻ nhập vào cũng là input
    //nếu ta click vào đó thì nó sẽ không thay đổi clickelement hiện tại (ô mà chúng ta hiện dữ liệu sau khi AI trả về).
    if (checkInput(clickedElement) && clickedElement.id !== "text-chat-with-ai") {
        editableElement = clickedElement;
        addIconToClickedField(clickedElement);
    }
}


//2.===========================Kết thúc kiểm tra điều kiện hiển thị icon và addIcon================================== 



/*3.======================================================================
                   CÁC HÀM ADD ICON
======================================================================             
*/


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
    icon.style.zIndex = "66666666";
    clickedElement.parentNode.appendChild(icon);

    var container = createContainer();
    document.body.appendChild(container);
    //clickedElement.parentNode.appendChild(container);

    // createPopup();
    // openCustomPopup();

    var img = createImg();
    icon.appendChild(img);

    // Thêm sự kiện click cho icon để hiển thị popup
    icon.addEventListener("click", function () {
        toggleFileVisibility(icon); // Gọi hàm hiển thị popup khi icon được click
    });
}

//Hàm tạo Container de bao bọc bên ngoài popup_func chọn chức năng
function createContainer() {
    var container = document.createElement("div");
    container.id = "file-container"; // Add classes or styles for your icon
    // container.style.display = "block";
    container.style.position = "fixed";
    container.style.zIndex = "777777777"
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

//Hàm khởi tạo nút button để chứa số 6 tạo ra từ hàm createImg ở trên
function createIcon() {
    var icon = document.createElement("button");
    icon.className = "icon"; // Add classes or styles for your icon
    icon.style.width = "20px";
    icon.style.height = "20px";
    icon.type = "button";
    return icon;
}


//3.=====================Kết thúc các hàm add Icon=========================================== 



/*4.======================================================================
        CÁC HÀM THỰC HIỆN KHI CLICK VÀO ICON THÌ HIỂN THỊ RA BẢNG ĐỂ TƯƠNG TÁC VỚI USER VÀ BẮT CÁC SỰ KIỆN CHỨC NĂNG
    ====================================================================== 
 */



//Hàm hiển thị file-container 
function toggleFileVisibility(icon) {
    const fileContainer = document.querySelector("#file-container");
    if (fileContainer.textContent == '') {
        createInnerContainer(icon);
    } else {
        fileContainer.style.display = "block";
    }
}

// Ẩn File-Container để lúc sau cần thì chỉ cần chuyển sang dạng block để hiển thị lại, k cần phải tạo mới
function hideFileContainer() {
    document.querySelector("#file-container").style.display = "none";
}


// Hàm để thiết lập yêu cầu truy cập tới file html,css để truy cập tới để set nội dung trong Container
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
//Hàm thiết lập cụ thể nội dung của file-container và bắt các sự kiện khi translate,revise,... ở trong đây
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
    setPositionForFileContainer(fileContainer, icon, rect);
    // Gọi hàm setRelativePosition mỗi khi cửa sổ được cuộn hoặc thay đổi kích thước
    window.addEventListener('scroll', () => {
        setPositionForFileContainer(fileContainer, icon, rect);
    });
    window.addEventListener('resize', () => {
        setPositionForFileContainer(fileContainer, icon, rect);
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
    //======== Bắt sự kiện nút dịch========
    const iconTranslateElement = document.querySelector("#translate");
    const select = iconTranslateElement.querySelector("#select-language");
    select.addEventListener('change', function () {
        const selectedValue = select.value; // Lấy giá trị của option đã chọn
        const myContent = editableElement.value;
        if (selectedValue == "") {
            console.log("Chọn ngôn ngữ đi");
        } else {
            if (myContent === "") {
                console.log("Nhập input dô");
            } else {
                myNewContent = "Translate to " + selectedValue + " " + myContent;
                CallOpenAI(myNewContent);
            }

        }
    });
    //=======Bắt sự kiện nút revise======
    const iconReviseElement = document.querySelector("#revise");
    iconReviseElement.addEventListener('click', function () {
        const myContentRevise = editableElement.value;
        if (myContentRevise === "") {
            console.log("Nhập input vào");
        } else {
            myNewContentRevise = "Revise sentences: " + myContentRevise;
            CallOpenAI(myNewContentRevise);
        }
    })
    //=======Bắt sự kiện nút summarise=======
    const iconSummariseElement = document.querySelector("#summarize");
    iconSummariseElement.addEventListener('click', function () {
        const myContentSummarise = editableElement.value;
        if (myContentSummarise === "") {
            console.log("Nhập input vào");
        } else {
            myNewContentSummarise = "Summarise sentences: " + myContentSummarise;
            CallOpenAI(myNewContentSummarise);
        }
    })
    //======Bắt sự kiện chat AI====================
    const btnSendToChatAI=document.querySelector("#icon-send");
    btnSendToChatAI.addEventListener('click',()=>{
        const txtTextAskAI=document.querySelector("#text-chat-with-ai");
        if(txtTextAskAI.value===""){
            console.log("Nhập input vào");
        }else{
            myNewContentChatAI=txtTextAskAI.value;
            editableElement.value="";
            CallOpenAI(myNewContentChatAI);
        }
    })
    //Bắt sự kiện khi gõ text chat AI xong nhấn enter
    const txtTextAskAI_1=document.querySelector("#text-chat-with-ai");
    txtTextAskAI_1.addEventListener('keyup', (e)=>{
        if (e.key === "Enter") {
            if(txtTextAskAI_1.value===""){
                console.log("Nhập input vào");
            }else{
                myNewContentChatAI=txtTextAskAI_1.value;
                editableElement.value="";
                CallOpenAI(myNewContentChatAI);   
            }
        }
    })

    //===============Kết thúc bắt sự kiện trong popup-func================================================= 
}
//set Vị trí cho file-container lúc đầu tiên và khi thay đổi bằng resize hay là cuộn...
function setPositionForFileContainer(fileContainer, icon, rect) {
    //Set vị trí cho thẻ container bao ngoài
    console.log(icon);
    const iconRect = icon.getBoundingClientRect();
    console.log(icon.getBoundingClientRect());
    console.log(iconRect)
    const top = iconRect.top + iconRect.height;
    console.log(top);
    console.log(iconRect.top);
    console.log(iconRect.height);
    const left = iconRect.left + iconRect.width;
    if (top + rect.height <= window.innerHeight) {
        console.log(top + 5);
        fileContainer.style.top = `${top + 5}px`;
    }
    else {
        fileContainer.style.top = `${iconRect.top - rect.height - 5}px`;
    }
    if (left + rect.width <= window.innerWidth) {
        fileContainer.style.left = `${left}px`;
    }
    else {
        fileContainer.style.left = `${window.innerWidth - rect.width}px`
    }
}

// Tạo hàm để thiết lập URL của hình ảnh ở trong popup function, tức là lấy hình ảnh từ img để thêm vào trong file-container
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


//4.=======================Kết thúc hàm tương tác với icon để hiển thị ra popup và các chức năng translate,revise,...=========================================




/*5.======================================================================
            CÁC HÀM GỌI API OPENAI VÀ XỬ LÍ KHI TRUY CẬP API BỊ LỖI
    ======================================================================
*/



//Gọi API OpenAI
function CallOpenAI(myContent) {
    //Lấy txtValue để khi mà nó chạy sai đi, mà chạy lại lần nữa thì cái nội dung trong ô input vẫn là nội dung cũ
    //chứ không phải là loading...loading...
    const txtValue=editableElement.value;// sử dụng trong catch ở dưới
    //Thay đổi nội dung trong ô input loading để người dùng biết là tiến trình đang đc xử lí
    editableElement.value=txtValue+" Loading...";
    const token = "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";
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": "Please give me a concise answer. " + myContent }]
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        //abc.innertText=data.choices[0].message.content;
        a = data.choices[0].message.content;
        console.log(data);
        editableElement.value = a;
    }).catch(error => {
        
        //Để mà nếu xảy ra lỗi khi dịch thất bại, thì nó sẽ set cái lựa chọn ngôn ngữ về trạng thái là "Choose"
        const select1 = document.querySelector("#select-language");
        select1.selectedIndex = 0;
        editableElement.value=txtValue;
        // Hiển thị thông báo lỗi trên màn hình
        showErrorModal();
    });
}
// Hàm show ra hộp thoại lỗi khi truy cập tới OpenAI bị lỗi
function showErrorModal() {
    // Tạo một div để làm modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.zIndex = '999999999';// chú ý cái này vs cái overlay
    modal.style.left = '50%';
    modal.style.top = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px 30px 35px';
    modal.style.borderRadius = '5px';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

    // Tạo nội dung thông báo là chờ khoảng 10s
    const message = document.createElement('div');
    message.textContent = 'Error OpenAI.  Wait 10 seconds or Try again later';
    modal.appendChild(message);

    // Tạo nút close modal
    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.marginTop = '5px'; // Khoảng cách giữa nội dung và nút OK
    closeButton.style.left = '50%';
    closeButton.style.transform = 'translateX(-50%)';
    closeButton.onclick = function () {
        modal.remove();
        removeOverlay();// chú ý chỗ này là sẽ xóa đi cái Overlay để  mà có thể truy cập dô tương tác vs web
    };

    // Thêm nút close vào modal
    modal.appendChild(closeButton);

    // Thêm modal vào body của trang web
    document.body.appendChild(modal);
    //================================================
    // Tạo lớp overlay để nó chỉ thua 1 cái modal chứa nút OK 1 zIndex để nó khóa tương tác với web,
    //khi nào nhấn nút ok rồi thì nó với hiển thị lại trag web như bt cho mình xài.
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999999998';

    // Thêm overlay vào body để chặn tương tác với trang
    document.body.appendChild(overlay);

    function removeOverlay() {
        // Loại bỏ overlay khi modal đóng đi
        overlay.remove();
    }
}



//5.===========Kết thúc gọi OpenAI===========================================


// //https://youtu.be/SnV2fkAawrc?si=1coB_fwx_t1U5RHz