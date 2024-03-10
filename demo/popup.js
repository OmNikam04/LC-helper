document.addEventListener('DOMContentLoaded', function() {
    var generateBtn = document.getElementById('generateBtn');

    generateBtn.addEventListener('click', function() {
        // Send a message to the content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "generateCode"}, function(response) {
                if (response && response.success) {
                    alert("Code generated successfully!");
                } else {
                    alert("Error generating code.");
                }
            });
        });
    });
});
