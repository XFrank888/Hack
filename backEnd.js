chrome.storage.sync.get(null, (result) => {
  let mainDiv = document.createElement("div");
  mainDiv.setAttribute("class", "data");
  let assignmentsDiv = document.createElement("div");
  assignmentsDiv.setAttribute("class", "data");
  let gradesDiv = document.createElement("div");
  gradesDiv.setAttribute("class", "data");
  if (!result.assignments && !result.grades) {
    mainDiv.innerHTML = `Please visit <a href="https://blackboard.stonybrook.edu/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1" target="_blank">
        blackboard</a> to update grades and assignments list...`;
  } else {
    assignmentsDiv.innerHTML += "<p> Assignments: </p>";
    for (const [key, value] of Object.entries(result.assignments)) {
      assignmentsDiv.innerHTML += "<p>&emsp;" + key + "</p>";
      for (var i = 0; i < value.length; i++) {
        assignmentsDiv.innerHTML += `<a href="https://blackboard.stonybrook.edu${value[i].link}">&emsp;&emsp;${value[i].name}`;
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
    gradesDiv.innerHTML += "<br><br><br> <p> Grades: </p>";
    for (const [key, value] of Object.entries(result.grades)) {
      gradesDiv.innerHTML += "<p>&emsp;" + key + "</p>";
      for (const [key2, value2] of Object.entries(value)) {
        gradesDiv.innerHTML += `<p>&emsp;&emsp; ${key2}: ${value2}</p>`;
      }
      gradesDiv.innerHTML += "<br>";
    }

    let s = document.createElement("div");
    var seconds = Math.floor(
      (new Date().getTime() - result.lastUpdateTime) / 1000
    );
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 60);

    if (days > 0) {
      if (days == 1) s.innerHTML += `<p> Last update: ${days} day ago</p>`;
      else s.innerHTML += `<p> Last update: ${days} days ago</p>`;
    } else if (hours > 0) {
      if (hours == 1) s.innerHTML += `<p> Last update: ${hours} hour ago</p>`;
      else s.innerHTML += `<p> Last update: ${hours} hours ago</p>`;
    } else if (minutes > 0) {
      if (minutes == 1)
        s.innerHTML += `<p> Last update: ${minutes} minute ago</p>`;
      else s.innerHTML += `<p> Last update: ${minutes} minutes ago</p>`;
    } else {
      if (seconds == 1)
        s.innerHTML += `<p> Last update: ${seconds} second ago</p>`;
      else s.innerHTML += `<p> Last update: ${seconds} seconds ago</p>`;
    }

    s.innerHTML += `<p class='log'><a class='log' href='https://blackboard.stonybrook.edu/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1'  target='_blank'>
        Log into BlackBoard to update the assignments list
        </a></p>`;

    mainDiv.appendChild(assignmentsDiv);
    mainDiv.appendChild(gradesDiv);
    mainDiv.appendChild(s);
  }
  document.querySelector("body").appendChild(mainDiv);

  document.getElementById("assignment").innerHTML =
    "<p>" + assignmentsDiv + "</p>";
});
