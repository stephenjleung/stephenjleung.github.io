//baby name api key st918764


window.onload = function(){ 
    

var apiLink = "http://www.behindthename.com/api/";


var getRandomNames = function(gender,num) {
  
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    // Action to be performed when the document is read;
    var data = xhttp.responseXML;
    
    var x = data.getElementsByTagName("name");
    //console.log(x.length);
    //console.log(x[0].textContent);
    var firstName = "";
    
    //Empties the list of random names
    var node = document.getElementById("random-name");
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
    
    for (var i = 0; i < x.length; i++) {
      firstName = x[i].textContent;
      document.getElementById("random-name").insertAdjacentHTML("beforeend", firstName + "</br>");
    }
     
  }
};


var apiLink = "http://www.behindthename.com/api/random.php?usage=eng&number=" + num + "&gender=" + gender + "&key=st918764";

xhttp.open("GET", apiLink, true);
xhttp.send();

}

document.getElementById("random-button").onclick = function() {
  
  var gender = document.querySelector('input[name = "gender"]:checked').value;
  
  //console.log(gender);
  //console.log("male:" + document.getElementById("random-m").value);
  
  getRandomNames(gender,6)
};


//getRandomNames(6);

};