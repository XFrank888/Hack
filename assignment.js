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

  document.getElementById("btn_add").onclick = function () {
    var id = document.getElementById("id").value;
    var dueDate = document.getElementById("dueDate").value;
    var link = document.getElementById("link").value;
    var name = document.getElementById("name").value;
    var time = document.getElementById("time").value;
    //create the td
    var td_id = document.createElement("td");
    //create the node
    var idNode = document.createTextNode(id);
    //use the table
    td_id.appendChild(idNode);
    //create dueDate td
    var td_name = document.createElement("td");
    var dueDateNode = document.createTextNode(dueDate);
    td_name.appendChild(dueDateNode);

    //
    var td_gender = document.createElement("td");
    var genderNode = document.createTextNode(gender);
    td_gender.appendChild(genderNode);
    //4.创建tr
    var tr = document.createElement("tr");
    tr.appendChild(td_id);
    tr.appendChild(td_name);
    tr.appendChild(td_gender);
    //创建td和超链接
    //这里面有两层嵌套关系，一是td里面超链接标签a;而是标签a里面的文字 “删除”
    var td_a = document.createElement("td");
    var ele_a = document.createElement("a");
    ele_a.setAttribute("href", "javascript:void(0)");
    ele_a.setAttribute("onclick", "del(this)");
    var a_del = document.createTextNode("删除");
    ele_a.appendChild(a_del);
    td_a.appendChild(ele_a);
    //添加到tr中
    tr.appendChild(td_a);
    //5.获取table
    var table = document.getElementsByTagName("table")[0];
    table.appendChild(tr);
  };
});
