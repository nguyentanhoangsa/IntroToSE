document.addEventListener('click', action, false)

document.addEventListener('keyup',action, false)

function createIcon() {
    var icon = document.createElement('button');
    icon.className = 'icon'; // Add classes or styles for your icon
    icon.style.width = '20px'
    icon.style.height = '20px'
    //icon.value = "6"
    return icon;
}

function createImg() {
    var img = document.createElement('img');
    img.src ='https://cdn-icons-png.flaticon.com/512/6913/6913644.png';
    img.alt = '...';
    img.style.height = '18px';
    img.style.width = '18px';
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    return img;
}

//Function to add icon to the clicked input or textarea field
function addIconToClickedField(clickedElement) {
    var icon = createIcon();

    var existingIcon = document.querySelector('.icon');
    clickedElement.parentNode.style.position = "relative";
    const compStyles = getComputedStyle(clickedElement);
    const parentStyles = getComputedStyle(clickedElement.parentNode)

    // Remove existing icon if present
    if (existingIcon) {
        existingIcon.parentNode.removeChild(existingIcon);
    }

    // Add icon to the clicked input or textarea field

    icon.style.position = "absolute"
    icon.style.top = `${(clickedElement.offsetTop 
                        + parseFloat(compStyles.paddingBottom) + parseFloat(compStyles.borderBottom))}px`;
    //icon.style.top = compStyles.paddingTop;
    icon.style.right = `${clickedElement.parentNode.offsetWidth 
                            + parseFloat(compStyles.paddingRight) + parseFloat(compStyles.borderRight)
                            - clickedElement.offsetLeft - clickedElement.offsetWidth}px`;

    clickedElement.parentNode.appendChild(icon);
    var img = createImg();
    icon.appendChild(img);
}

function checkInput(clickedElement)
{
    return (clickedElement.tagName == "INPUT" && (clickedElement.type == "text" || clickedElement.type == "search"))
            || clickedElement.tagName == "TEXTAREA" 
            || clickedElement.role == "textbox"
}
// Event listener for clicking on input or textarea fields

function action()
{
    var clickedElement = document.activeElement;
    //console.log(clickedElement);

    // Check if the clicked element is an input or textarea field or the icon itself
    if (checkInput(clickedElement)) {
        addIconToClickedField(clickedElement);
    } else {
        // Remove the icon if clicked elsewhere on the document
        var icon = document.querySelector('.icon');
        if (icon && icon == clickedElement.nextSibling) {
            icon.parentNode.removeChild(icon);
        }
    }
}