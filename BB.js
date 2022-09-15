// This javascript file is going to run when user reaches the blackboard page.

let globalUrl = "https://blackboard.stonybrook.edu";

function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  try {
    return new ActiveXObject("Msxml2.XMLHTTP");
  } catch (error) {}
  try {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

// get all current(this semester) course ID in the bb main page and store in courseInfo object
// if currentSemester is true, then the courseInfo object would only contain all the courses in the current semester

function getCourseInfoObject(currentSemester = true) {
  let courseInfo = {};
  regex = /.*Course&id=.*[0-9]{5}/;
  let courseID_Arr = [];
  for (let i of document.querySelectorAll("*")) {
    if (currentSemester == false || i.innerHTML.startsWith("-")) {
      for (let j of i.attributes) {
        if (regex.test(j.value)) {
          let id = j.value.split("Course&id=_")[1].split("_")[0];
          courseID_Arr.push([id]);
          courseInfo[id] = {
            name: i.innerHTML,
            href: j.value.replace(" ", ""),
          };
        }
      }
    }
  }
  return courseInfo;
}

// Get the assignment page url
function getAssignmentsPageWithID(courseInfoObj, ID) {
  let request = makeHttpObject();
  console.log("requesting: ", courseInfoObj[ID].href);
  request.open("GET", courseInfoObj[ID].href, false);
  request.send(null);

  if (request.readyState == 4) {
    var matches = request.responseText.match(/.*<a.*Assignments/);
    matches = matches[matches.length - 1];
    var a = matches.split('<a href="');
    let assignmentPageURL = a[a.length - 1].split('" target="_self"')[0];
    return assignmentPageURL;
  }
}


// Get individual assignments url from the assignment page
function getAssignmentLinkList(assignmentPageURL) {
  var request = makeHttpObject();
  request.open("GET", assignmentPageURL, false);
  request.send(null);

  if (request.readyState == 4) {
    var matches = request.responseText.match(
      /\/webapps.*uploadAssignment.*mode=view/g
    );

    return matches;
  }
}

// Pass in assignmentLinkList and return a toDoList
function getToDoList(assignmentLinkList) {
  let toDoList = [];

  assignmentLinkList.forEach((link) => {
    console.log("visiting link: ", link);
    var request = makeHttpObject();
    request.open("GET", link, false);
    request.send(null);

    if (request.readyState == 4) {
      var dueDate = request.responseText.match(
        /[A-Z][a-z]*, [A-Z][a-z]* [0-9]*, 20[0-9]{2}/g
      );
      // if the assignment has been completed then skip this assignment
      if (dueDate == null) {
        console.log("Assignment Completed / Expired");
      } else {
        dueDate = dueDate[0];
        var timeMatch = request.responseText.match(/[0-9]+:[0-9]{2} .M/g);
        var assignmentNameMatch = request.responseText.match(
          /Upload Assignment: .*<\/span>/g
        );
        var assignmentName = assignmentNameMatch[0]
          .split("Assignment: ")[1]
          .split("</span>")[0];
        var time = timeMatch[0];

        if (dueDate != null && assignmentName != null) {
          if (new Date(dueDate + " 11:59 pm") - new Date() > 0) {
            toDoList.push({ link: link, name: assignmentName, dueDate: dueDate, time: time });
          }
        }
      }
    }
  });
  return toDoList;
}

function GenerateToDoList(){
  let courseInfo = getCourseInfoObject();
  console.log("courseInfo: ", courseInfo);
  let toDoList = {};
  

  for (const [key, value] of Object.entries(courseInfo)){
    try {
      console.log("Processing course: ", value.name);
      let assignmentPageURL = getAssignmentsPageWithID(courseInfo, key);
      console.log("assignmentPageURL: ", assignmentPageURL);
      let assignmentURLs = getAssignmentLinkList(assignmentPageURL);
      console.log("assignmentURLs: ", assignmentURLs);
      if (assignmentURLs != null){
        let courseToDoList = getToDoList(assignmentURLs);
        console.log("courseToDoList", courseToDoList);
        toDoList[`${value.name}`] = courseToDoList;
      }
    } catch (error) {
      console.log(error);
    }

  }

  console.log("toDoList", toDoList);
  return toDoList;

  
}



// Get the My Grades page url
function getGradesPageWithID(courseInfoObj, ID) {
  let request = makeHttpObject();
  console.log("requesting: ", courseInfoObj[ID].href);
  request.open("GET", courseInfoObj[ID].href, false);
  request.send(null);

  if (request.readyState == 4) {
    var matches = request.responseText.match(/.*<a.*My Grades/);
    if (!matches){
      return null;
    }
    matches = matches[matches.length - 1];
    var a = matches.split('<a href="');
    let gradesPageURL = a[a.length - 1].split('" target="_self"')[0];
    return gradesPageURL;
  }
}


function getGradesList(gradesPageURL){
  if (!gradesPageURL){
    return {};
  }

  let request = makeHttpObject();
  console.log("requesting: ", gradesPageURL);
  request.open("GET", gradesPageURL, false);
  request.send(null);

  if (request.readyState == 4) {
    var tempdiv = document.createElement("div");
    tempdiv.innerHTML = request.responseText;
    let gradeDivs = tempdiv.getElementsByClassName("graded_item_row");
    let grades = {};

    for (var i = 0; i < gradeDivs.length; i++){
      let text = gradeDivs[i].textContent.split("\n");
      let name;
      let grade;
      for(var j = 0; j < text.length; j++){
          let t = text[j].strip();
          if (t.length == 0)
            continue;
          if (!name)
            name = t;

          if (t.match(/(0-9|\.)+\/(0-9|\.)+/))
            grade = t;
          
          else if (t.match(/(0-9|\.)+%/))
            grade = t;
          
          else if (t.match(/(0-9|\.)+/))
            grade = t;
          
          else if (t.length == 1 && t.match(/[A-Z]/g))
            grade = t;
          
          if (name && grade)
            break;
          
          
      }
      console.log("name", name);

      console.log("grade", grade);
      grades[`${name}`] = grade;
    }
    console.log(grades);
    
    return grades;
  }
}

function generateGradeList(){
  let courseInfo = getCourseInfoObject();
  console.log("courseInfo: ", courseInfo);

  let GradesCollction = {};
  for (const [key, value] of Object.entries(courseInfo)){
    let gradesPageURL = getGradesPageWithID(courseInfo, key);
    let GradesList = getGradesList(gradesPageURL);
    GradesCollction[value.name] = GradesList;
  }
  console.log("GradesCollction", GradesCollction);
  return GradesCollction;
}
// get toDoList
GenerateToDoList();


// get Grades
generateGradeList();