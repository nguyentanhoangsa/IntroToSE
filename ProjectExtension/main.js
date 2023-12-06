function createIcon() {
    var icon = document.createElement('span');
    icon.className = 'icon'; // Add classes or styles for your icon
    icon.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/6335/6335609.png" alt="..." style="heigth:20px;width:20px">'; // Replace with your icon path
    return icon;
}

//Function to add icon to the clicked input or textarea field
function addIconToClickedField(clickedElement) {
    var icon = createIcon();
    var existingIcon = document.querySelector('.icon');
    clickedElement.parentNode.style.position = "relative";
    const compStyles = getComputedStyle(clickedElement);
    //const compParentStyles=getComputedStyle(clickedElement.parentNode);
    // Remove existing icon if present
    if (existingIcon) {
        existingIcon.parentNode.removeChild(existingIcon);
    }

    // Add icon to the clicked input or textarea field

    icon.style.position = "absolute"
    icon.style.top = (parseFloat(clickedElement.offsetHeight)/2 -10.0).toString()+"px"
    //icon.style.top = compStyles.paddingTop;
    icon.style.left = `${clickedElement.offsetLeft + clickedElement.offsetWidth 
                        - 20 - parseFloat(compStyles.paddingRight) - parseFloat(compStyles.borderRight)}px`;

    clickedElement.parentNode.insertBefore(icon, clickedElement.nextSibling);

}

function checkInput(clickedElement)
{
    return clickedElement.tagName == "INPUT" 
            || clickedElement.tagName == "TEXTAREA" 
            || clickedElement.role == "textbox"
}
// Event listener for clicking on input or textarea fields
document.addEventListener('click', function (event) {
    var clickedElement = event.target;
    //console.log(clickedElement);

    // Check if the clicked element is an input or textarea field or the icon itself
    if (checkInput(clickedElement)) {
        addIconToClickedField(clickedElement);
    } else {
        // Remove the icon if clicked elsewhere on the document
        var icon = document.querySelector('.icon');
        if (icon) {
            icon.parentNode.removeChild(icon);
        }
    }
})