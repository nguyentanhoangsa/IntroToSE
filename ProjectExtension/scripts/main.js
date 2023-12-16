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
  
  // Hàm để thiết lập nội dung cho popup
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
  
  document.addEventListener("click", action, false);
  
  document.addEventListener(
    "keyup",
    () => {
      action();
    },
    false
  );
  
  function createIcon() {
    var icon = document.createElement("button");
    icon.className = "icon"; // Add classes or styles for your icon
    icon.style.width = "20px";
    icon.style.height = "20px";
    //icon.value = "6"
  
    // Thêm sự kiện click cho icon để hiển thị popup
    icon.addEventListener("click", function () {
      toggleFileVisibility(); // Gọi hàm hiển thị popup khi icon được click
    });
    return icon;
  }
  
  function createContainer() {
    var container = document.createElement("div");
    container.id = "file-container"; // Add classes or styles for your icon
    container.style.display = "none";
    return container;
  }
  
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
  
  //Function to add icon to the clicked input or textarea field
  function addIconToClickedField(clickedElement) {
    var icon = createIcon();
    var container = createContainer();
  
    var existingIcon = document.querySelector(".icon");
    clickedElement.parentNode.style.position = "relative";
    const compStyles = getComputedStyle(clickedElement);
    const parentStyles = getComputedStyle(clickedElement.parentNode);
  
    // Remove existing icon if present
    if (existingIcon) {
      existingIcon.parentNode.removeChild(existingIcon);
    }
  
    // Add icon to the clicked input or textarea field
    icon.style.position = "absolute";
    icon.style.top =
      (
        clickedElement.offsetHeight / 2 -
        10.0 +
        parseFloat(parentStyles.paddingTop) +
        parseFloat(parentStyles.borderTop)
      ).toString() + "px";
    //icon.style.top = compStyles.paddingTop;
    icon.style.right = `${
      clickedElement.parentNode.offsetWidth +
      parseFloat(compStyles.paddingRight) +
      parseFloat(compStyles.borderRight) -
      clickedElement.offsetLeft -
      clickedElement.offsetWidth
    }px`;
  
    clickedElement.parentNode.insertBefore(icon, clickedElement.nextSibling);
    clickedElement.parentNode.insertBefore(container, clickedElement.nextSibling);
  
    // createPopup();
    // openCustomPopup();
  
    var img = createImg();
    icon.appendChild(img);
  }
  
  function checkInput(clickedElement) {
    return (
      (clickedElement.tagName == "INPUT" &&
        (clickedElement.type == "text" || clickedElement.type == "search")) ||
      clickedElement.tagName == "TEXTAREA" ||
      clickedElement.role == "textbox"
    );
  }
  
  // Event listener for clicking on input or textarea fields
  function action() {
    var clickedElement = document.activeElement;
    // console.log("Hello");
  
    // Check if the clicked element is an input or textarea field or the icon itself
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
  