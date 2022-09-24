// this script checks whether this is a course

course_regex = /Homepage - -[A-Z]{3}.*202[0-9]/;
var title = document.querySelector("title").text;
var isCourse = course_regex.test(title);

if (isCourse){
    var courseID = document.URL.split("home/")[1];
    chrome.storage.sync.get(null, (result) => {
    
        if (result.courseInfoBS == null){
            let courseInfoBS = [{courseID: courseID, courseName: title, courseURL: document.URL}];
            chrome.storage.sync.set({ "courseInfoBS": courseInfoBS});
        }
        else{
            let courseInfoBS = result.courseInfoBS;
            var existed = false;
            for (var obj of courseInfoBS){
                if (obj.courseURL == document.URL){
                    existed = true;
                    break;
                }
            }
            if (! existed){
                courseInfoBS.push({courseID: courseID, courseName: title, courseURL: document.URL});
                chrome.storage.sync.set({ "courseInfoBS": courseInfoBS});
            }
            else{
                console.log("existed");
            }
            console.log(result);
            
        }
        
    })
}



