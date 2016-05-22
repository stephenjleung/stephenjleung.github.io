//baby name api key st918764


window.onload = function(){ 
    

var apiLink = 'http://www.behindthename.com/api/';




var getRandomNames = function(num) {
  
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    // Action to be performed when the document is read;
    //console.log(xhttp.responseText);
    var data = xhttp.responseXML;
    
    var x = data.getElementsByTagName('name');
    console.log(x.length);
    console.log(x[0].textContent);
    var firstName = '';
    
    //Empties the list of random names
    var node = document.getElementById('random-name');
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
    
    for (var i = 0; i < x.length; i++) {
      firstName = x[i].textContent;
      document.getElementById('random-name').insertAdjacentHTML('beforeend', firstName + '</br>');
    }
     
  }
};

xhttp.open('GET', 'http://www.behindthename.com/api/random.php?usage=eng&number=' + num + '&key=st918764', true);
xhttp.send();

}
document.getElementById("random-button").onclick = function() {getRandomNames(6)};


//getRandomNames(6);

};