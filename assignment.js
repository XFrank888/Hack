chrome.storage.sync.get(null, (result) => {
  // let mainDiv = document.createElement("div");
  // mainDiv.setAttribute("class", "data");
  // let assignmentsDiv = document.createElement("div");
  // assignmentsDiv.setAttribute("class", "data");
  // let gradesDiv = document.createElement("div");
  // gradesDiv.setAttribute("class", "data");


  if (!result.assignments && !result.grades && !result.assignmentsBS) {
    let div = document.getElementById(assignments);
    div.innerHTML = `Please visit <a href="https://blackboard.stonybrook.edu/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1" target="_blank">
        blackboard</a> and <a href="https://mycourses.stonybrook.edu/d2l/home" target="_blank">
        brightspace</a> to update grades and assignments list...`;
  } else {
    let tbody = document.querySelector("tbody");
    if (result.assignments){
    for (const [key, value] of Object.entries(result.assignments)) {
      for (var i = 0; i < value.length; i++) {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "active-row");
        let courseName = document.createElement("td");
        let assignmentName = document.createElement("td");
        let dueDate = document.createElement("td");

        courseName.innerHTML = key;


        assignmentName.innerHTML = `<a href="https://blackboard.stonybrook.edu${value[i].link}">&emsp;&emsp;${value[i].name}`;
        dueDate.innerHTML = value[i].dueDate + " " + value[i].time;

        tr.appendChild(courseName);
        tr.appendChild(assignmentName);
        tr.appendChild(dueDate);
        tbody.appendChild(tr);

      }
    }
  }
    if (result.assignmentsBS){
    for (const [key, value] of Object.entries(result.assignmentsBS)) {
      for (var i = 0; i < value.length; i++) {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "active-row");
        let courseName = document.createElement("td");
        let assignmentName = document.createElement("td");
        let dueDate = document.createElement("td");

        courseName.innerHTML = key.split("Homepage - ")[1];


        assignmentName.innerHTML = value[i][0];
        dueDate.innerHTML = value[i][1];

        tr.appendChild(courseName);
        tr.appendChild(assignmentName);
        tr.appendChild(dueDate);
        tbody.appendChild(tr);

      }
    }
  }
if (result.grades){
    grade_tbody = document.querySelector(".grade-tbody");
    for (const [key, value] of Object.entries(result.grades)) {
      for (const [key2, value2] of Object.entries(value)) {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "active-row");
        let courseName = document.createElement("td");
        let assignmentName = document.createElement("td");
        let grade = document.createElement("td");


        courseName.innerHTML = key;
        assignmentName.innerHTML = key2;
        grade.innerHTML = value2;

        tr.appendChild(courseName);
        tr.appendChild(assignmentName);
        tr.appendChild(grade);
        grade_tbody.appendChild(tr);

      }

    }
    }

    // let s = document.createElement("div");
    // var seconds = Math.floor(
    //   (new Date().getTime() - result.lastUpdateTime) / 1000
    // );
    // var minutes = Math.floor(seconds / 60);
    // var hours = Math.floor(minutes / 60);
    // var days = Math.floor(hours / 60);

  //   if (days > 0) {
  //     if (days == 1) s.innerHTML += `<p> Last update: ${days} day ago</p>`;
  //     else s.innerHTML += `<p> Last update: ${days} days ago</p>`;
  //   } else if (hours > 0) {
  //     if (hours == 1) s.innerHTML += `<p> Last update: ${hours} hour ago</p>`;
  //     else s.innerHTML += `<p> Last update: ${hours} hours ago</p>`;
  //   } else if (minutes > 0) {
  //     if (minutes == 1)
  //       s.innerHTML += `<p> Last update: ${minutes} minute ago</p>`;
  //     else s.innerHTML += `<p> Last update: ${minutes} minutes ago</p>`;
  //   } else {
  //     if (seconds == 1)
  //       s.innerHTML += `<p> Last update: ${seconds} second ago</p>`;
  //     else s.innerHTML += `<p> Last update: ${seconds} seconds ago</p>`;
  //   }

  //   s.innerHTML += `<p class='log'><a class='log' href='https://blackboard.stonybrook.edu/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1'  target='_blank'>
  //       Log into BlackBoard to update the assignments list
  //       </a></p>`;

  //   mainDiv.appendChild(assignmentsDiv);
  //   mainDiv.appendChild(gradesDiv);
  //   mainDiv.appendChild(s);
  // }
  // document.querySelector("body").appendChild(mainDiv);

  
  }});
