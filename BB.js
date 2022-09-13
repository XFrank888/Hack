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

// Get the assignment page url and store in the gloabl res array at index 1
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



let courseInfo = getCourseInfoObject();
console.log("courseInfo: ", courseInfo);
let assignmentPageURL = getAssignmentsPageWithID(courseInfo, "50107");
console.log("assignmentPageURL: ", assignmentPageURL);
let assignmentURLs = getAssignmentLinkList(assignmentPageURL);
console.log("assignmentURLs: ", assignmentURLs);
