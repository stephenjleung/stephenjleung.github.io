//baby name api key st918764

var apiLink = "http://www.behindthename.com/api/";

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
     // Action to be performed when the document is read;
     //console.log(xhttp.responseText);
     var data = xhttp.responseXML;
     
     var x = data.getElementsByTagName("name");
     console.log(x);
     console.log(x[0].textContent);
     var firstName = x[0].textContent;
     document.getElementById("random-name").innerHTML = firstName;
  }
};

xhttp.open("GET", "http://www.behindthename.com/api/random.php?usage=eng&key=st918764", true);
xhttp.send();