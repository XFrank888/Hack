let assignmentsDiv = document.createElement("div");
assignmentsDiv.setAttribute("class", "data");
chrome.storage.sync.get(null, (result) => {
  document.getElementById("assignment").innerHTML =
    "<p>" + JSON.stringify(result.assignments) + "</p>";
  document.getElementById("assignmentName").innerHTML =
    "<p>" + JSON.stringify(result.assignments.key) + "</p>";
  for (const [key, value] of Object.entries(result.assignments)) {
    assignmentsDiv.innerHTML += "<p>&emsp;" + key + "</p>";
    for (var i = 0; i < value.length; i++) {
      <tr></tr>;

      assignmentsDiv.innerHTML += `<p>&emsp;&emsp;&emsp; due ${
        value[i].dueDate + " " + value[i].time
      }</p>`;

      // for (const [key2, value2] of Object.entries(value[i])){
      //     if (key2 != "name" && key2 != "link"){
      //         assignmentsDiv.innerHTML += `<p>&emsp;&emsp;&emsp; ${key2}: ${JSON.stringify(value2)}</p>`;
      //     }
      // }
    }
    assignmentsDiv.innerHTML += "<br>";
  }
});
