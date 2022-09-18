// This javascript file is going to run when user reaches the blackboard page.

// Ensure this script runs after all js code has been evaluated

// chrome.storage.sync.set({"test": "test"});
// chrome.storage.sync.get(["test"], result => {
//     console.log(result.test);
// })

function myMain(verbose = true, getAssignment = true, getGrade = true) {
  chrome.storage.sync.get(["courseInfo, courseInfoUpdateTime", "test"], (result) => {
    chrome.storage.sync.set({"test": "testVal2"});

    
    console.log(result);
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

    function getCourseInfoObject(currentSemester = true, verbose) {
      if (!result.courseInfo) {
        console.log(result.courseInfo);
        console.log("creating new course info obj...");
        var courseInfo = getNewCourseInfoObject(currentSemester);

        return courseInfo;
      }
      var seconds = Math.floor(((new Date()).getTime() - result.courseInfoUpdateTime) / 1000);
      console.log("seconds", seconds);

    }

    function getNewCourseInfoObject(currentSemester = true, verbose) {
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
      if (JSON.stringify(courseInfo.length) != "{}"){
        let currentTime = new Date().getTime();
        chrome.storage.sync.set({ "courseInfo": courseInfo, "courseInfoUpdateTime": currentTime }, function() {
            console.log('courseInfo is set to ' + JSON.stringify(courseInfo));
            console.log('courseInfoUpdateTime is set to ' + JSON.stringify(currentTime));
        });

    }

      return courseInfo;
    }

    // Get the assignment page url
    function getAssignmentsPageWithID(courseInfoObj, ID, verbose) {
      let request = makeHttpObject();
      if (verbose) console.log("requesting: ", courseInfoObj[ID].href);
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
    function getAssignmentLinkList(assignmentPageURL, verbose) {
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
    function getToDoList(assignmentLinkList, verbose) {
      let toDoList = [];

      assignmentLinkList.forEach((link) => {
        if (verbose) console.log("visiting link: ", link);
        var request = makeHttpObject();
        request.open("GET", link, false);
        request.send(null);

        if (request.readyState == 4) {
          var dueDate = request.responseText.match(
            /[A-Z][a-z]*, [A-Z][a-z]* [0-9]*, 20[0-9]{2}/g
          );
          // if the assignment has been completed then skip this assignment
          if (dueDate == null) {
            if (verbose) console.log("Assignment Completed / Expired");
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
                toDoList.push({
                  link: link,
                  name: assignmentName,
                  dueDate: dueDate,
                  time: time,
                });
              }
            }
          }
        }
      });
      return toDoList;
    }

    function generateToDoList(verbose) {
      let courseInfo = getCourseInfoObject();
      if (verbose) console.log("courseInfo: ", courseInfo);
      let toDoList = {};

      for (const [key, value] of Object.entries(courseInfo)) {
        try {
          if (verbose) console.log("Processing course: ", value.name);
          let assignmentPageURL = getAssignmentsPageWithID(
            courseInfo,
            key,
            verbose
          );
          if (verbose) console.log("assignmentPageURL: ", assignmentPageURL);
          let assignmentURLs = getAssignmentLinkList(
            assignmentPageURL,
            verbose
          );
          if (verbose) console.log("assignmentURLs: ", assignmentURLs);
          if (assignmentURLs != null) {
            let courseToDoList = getToDoList(assignmentURLs, verbose);
            if (verbose) console.log("courseToDoList", courseToDoList);
            toDoList[`${value.name}`] = courseToDoList;
          }
        } catch (error) {
          if (verbose) console.log(error);
        }
      }
      if (verbose) console.log("toDoList", toDoList);
      return toDoList;
    }

    // Get the My Grades page url
    function getGradesPageWithID(courseInfoObj, ID, verbose) {
      let request = makeHttpObject();
      if (verbose) console.log("requesting: ", courseInfoObj[ID].href);
      request.open("GET", courseInfoObj[ID].href, false);
      request.send(null);

      if (request.readyState == 4) {
        var matches = request.responseText.match(/.*<a.*My Grades/);
        if (!matches) {
          return null;
        }
        matches = matches[matches.length - 1];
        var a = matches.split('<a href="');
        let gradesPageURL = a[a.length - 1].split('" target="_self"')[0];
        return gradesPageURL;
      }
    }

    function getGradesList(gradesPageURL, verbose = true) {
      if (!gradesPageURL) {
        return {};
      }

      let request = makeHttpObject();
      if (verbose) console.log("requesting: ", gradesPageURL);
      request.open("GET", gradesPageURL, false);
      request.send(null);

      if (request.readyState == 4) {
        var tempdiv = document.createElement("div");
        tempdiv.innerHTML = request.responseText;
        let gradeDivs = tempdiv.getElementsByClassName("graded_item_row");
        let grades = {};

        for (var i = 0; i < gradeDivs.length; i++) {
          let text = gradeDivs[i].textContent.split("\n");
          let name;
          let grade;
          for (var j = 0; j < text.length; j++) {
              let t = text[j].toString().trim();
            
            if (t.length == 0) continue;
            
            if (!name) name = t;

            if (t.match(/(0-9|\.)+\/(0-9|\.)+/)) grade = t;
            else if (t.match(/(0-9|\.)+%/)) grade = t;
            else if (t.match(/(0-9|\.)+/)) grade = t;
            else if (t.length == 1 && t.match(/[A-Z]/g)) grade = t;

            if (name && grade) break;
          }
          if (verbose) console.log("name", name);
          if (verbose) console.log("grade", grade);
          grades[`${name}`] = grade;
        }
        if (verbose) console.log(grades);

        return grades;
      }
    }

    function generateGradeList(verbose) {
      let courseInfo = getCourseInfoObject();
      if (verbose) console.log("courseInfo: ", courseInfo);

      let GradesCollction = {};
      for (const [key, value] of Object.entries(courseInfo)) {
        let gradesPageURL = getGradesPageWithID(courseInfo, key, verbose);
        let GradesList = getGradesList(gradesPageURL, verbose);
        GradesCollction[value.name] = GradesList;
      }
      if (verbose) console.log("GradesCollction", GradesCollction);
      return GradesCollction;
    }
    // get toDoList
    if (getAssignment) generateToDoList(verbose);

    // get Grades
    if (getGrade) generateGradeList(verbose);
  });
}

var i = 0;
const interval = setInterval(function () {
  if (i < 3) {
    if (i % 2 == 0) myMain(true, false, true);
    else myMain(true, true, false);
    console.log(i);
  } else {
    if (i % 600 == 0) {
      myMain();
      console.log(i);
    }
  }
  i++;
}, 1000);
