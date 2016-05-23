//baby name api key st918764


window.onload = function(){ 

if (Boolean(window.localStorage._stephenjleung_favoritenames))
  var favorites = JSON.parse(window.localStorage.getItem('_stephenjleung_favoritenames'));
else
  var favorites = ["Dave", "John", "Steve","Adam"];

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


var addToFavorites = function(name) {
  favorites.push(name);
  saveToLocalStorage(favorites);
};

var removeFromFavorites = function(name) {
  var index = favorites.indexOf(name);
  if (index > -1) {
    favorites.splice(index, 1);
    saveToLocalStorage(favorites);
  }
    
};

var updateFavorites = function() {
  for (var i = 0; i < favorites.length; i++) {
      document.getElementById("favorites").insertAdjacentHTML("beforeend", favorites[i] + "</br>");
    }
};

updateFavorites();

var saveToLocalStorage = function(favorites) {
  window.localStorage.setItem('_stephenjleung_favorites',JSON.stringify(favorites));
};

};