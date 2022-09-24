chrome.storage.sync.get(null, (result) => {
    document.getElementById("assignment").innerHTML =
    "<p>" + JSON.stringify(result.assignments) + "</p>";
})