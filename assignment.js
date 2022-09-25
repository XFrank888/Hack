chrome.storage.sync.get(null, (result) => {
  // let mainDiv = document.createElement("div");
  // mainDiv.setAttribute("class", "data");
  // let assignmentsDiv = document.createElement("div");
  // assignmentsDiv.setAttribute("class", "data");
  // let gradesDiv = document.createElement("div");
  // gradesDiv.setAttribute("class", "data");

  if (!result.assignments && !result.grades && !result.assignmentsBS) {
    let div = document.getElementById("table-div");
    div.innerHTML = `<a id="update-p" style="font-size: large">Please click the update button to update your assignments and grades for the first time!</a>`;
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

    
  
  }
 
})


let link = document.getElementById("link");
link.addEventListener("click", openLink, false);
function openLink() {
  open('https://blackboard.stonybrook.edu/')
}