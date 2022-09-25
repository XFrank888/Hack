chrome.storage.sync.get(null, (result) => {
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


  var assignmentsBS = {};

  for (var course of result.courseInfoBS) {
    let assignmentsPageLink = `https://mycourses.stonybrook.edu/d2l/lms/dropbox/user/folders_list.d2l?ou=${course.courseID}&isprv=0`;
    let request = makeHttpObject();
    console.log("requesting: ", assignmentsPageLink);
    request.open("GET", assignmentsPageLink, false);
    request.send(null);

    if (request.readyState == 4) {
      var tempdiv = document.createElement("div");
      tempdiv.innerHTML = request.responseText;
      let assignments = tempdiv.getElementsByClassName("d_ich");

      let assignmentsArr = [];
      let dueDatesArr = [];

      for (var a of assignments) {
        assignmentsArr.push(a.innerText);
      }
      let dueDates = tempdiv.getElementsByClassName("d_gn d_gc d_gt");
      for (var d of dueDates) {
        if (
          !d.innerText.includes("Submitted") &&
          !d.innerText.includes("Submission")
        )
          dueDatesArr.push(d.innerText);
      }

      let assignmentsDueDatePair = [];
      for (var i = 0; i < assignmentsArr.length; i++) {
        assignmentsDueDatePair.push([assignmentsArr[i], dueDatesArr[i]]);
      }

      console.log(assignmentsDueDatePair);
      assignmentsBS[course.courseName] = assignmentsDueDatePair;

    }
    chrome.storage.sync.set({ assignmentsBS: assignmentsBS });
    console.log(result.assignmentsBS);
    let currentTime = new Date().getTime();
    chrome.storage.sync.set({ "lastUpdateTimeBS": currentTime});
  }

});
