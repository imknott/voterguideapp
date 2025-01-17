function typeText(elementId, text, delay) {
    let index = 0;
    const element = document.getElementById(elementId);

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, delay);
        }
        else {
            element.setAttribute("style", "animation: none;");
            element.setAttribute("style", "border-right: none;");
        }
    }

    type();
}

document.addEventListener('DOMContentLoaded', function() {
    typeText('voting-guide', 'Voting Guide \uD83C\uDDFA\uD83C\uDDF8', 100); // Typing effect for h1
    setTimeout(() => typeText('ideal-candidate', '\uD83D\uDC4D\uFE0F Helping you find the Ideal Candidate \uD83D\uDC4D\uFE0F', 100), 1500); // Typing effect for h2
});