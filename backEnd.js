chrome.storage.sync.get(null, result => {
    
    let mainDiv = document.createElement("div");
    mainDiv.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>";
    let assignmentsDiv = document.createElement("div");
    let gradesDiv = document.createElement("div");
    if (!result.assignments && !result.grades){
        mainDiv.innerHTML = `Please visit <a href="https://blackboard.stonybrook.edu/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1" target="_blank">
        blackboard</a> to update grades and assignments list...`
    }
    else{
        
        for (const [key, value] of Object.entries(result.assignments)){
            assignmentsDiv.innerHTML += "<p>" + key + "</p>";
            assignmentsDiv.innerHTML += "<p>" + JSON.stringify(value) + "</p>";

        }
        for (const [key, value] of Object.entries(result.grades)){
            gradesDiv.innerHTML += "<p>" + key + "</p>";
            gradesDiv.innerHTML += "<p>" + JSON.stringify(value) + "</p>";
        }
        
        mainDiv.appendChild(assignmentsDiv);
        mainDiv.appendChild(gradesDiv);
        

    }
    document.querySelector("body").appendChild(mainDiv);

})