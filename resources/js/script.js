//baby name api key st918764

window.onload = function(){ 

  // Loads a saved or default Favorites list
  if (Boolean(window.localStorage._stephenjleung_favorites))
    var favorites = JSON.parse(window.localStorage.getItem('_stephenjleung_favorites'));
  else
    favorites = ["Dave", "John", "Steve","Adam"];
  
  // Helper function to empty html contents by element ID
  var emptyElementById = function(id) {
    var node = document.getElementById(id);
        while (node.hasChildNodes()) {
          node.removeChild(node.firstChild);
        }
  };
  
  // Function to get random baby names based on filters (API GET request here)
  var getRandomNames = function(gender,num) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        
        // Action to be performed when the document is read;
        var data = xhttp.responseXML;
        var x = data.getElementsByTagName("name");
        var firstName = "";
        
        //Empties the list of random names in the DOM before generating a new list
        emptyElementById("random-name");
        
        // Generates the list of random names obtained from API call
        for (var i = 0; i < x.length; i++) {
          firstName = x[i].textContent;
          document.getElementById("random-name").insertAdjacentHTML("beforeend", firstName + "</br>");
        }
      }
    };
  
    var apiLink = "http://www.behindthename.com/api/random.php?usage=eng&number=" + num + "&gender=" + gender + "&key=st918764";
    xhttp.open("GET", apiLink, true);
    xhttp.send();
  
  };
  
  // Action triggered when "Get Random" button is clicked
  document.getElementById("random-button").onclick = function() {
    var gender = document.querySelector('input[name = "gender"]:checked').value;
    getRandomNames(gender,6);
  };
  
  // Action triggered when you click the "Add" to favorites button
  document.getElementById("favorite-button-add").onclick = function() {
    var nameToAdd = document.getElementById("favorite-input").value;
    addToFavorites(nameToAdd);
    updateFavorites();
  };
  
  // Function to add a name to favorites and update LocalStorage
  var addToFavorites = function(name) {
    if (name != "") {
      favorites.push(name);
      saveToLocalStorage(favorites);
      document.getElementById("favorite-input").value = "";
    }
  };
  
  // Function to remove a specific name from the favorites list
  var removeFromFavorites = function(name) {
    var index = favorites.indexOf(name);
    if (index > -1) {
      favorites.splice(index, 1);
      saveToLocalStorage(favorites);
    }
      
  };
  
  // Function to refresh or reload the current Favorites list
  var updateFavorites = function() {
    
    emptyElementById("favorites");
    
    for (var i = 0; i < favorites.length; i++) {
        document.getElementById("favorites").insertAdjacentHTML("beforeend", favorites[i] + "</br>");
      }
  };
  
  updateFavorites();
  
  
  
  // Function to update the LocalStorage value
  var saveToLocalStorage = function(favorites) {
    window.localStorage.setItem('_stephenjleung_favorites',JSON.stringify(favorites));
  };

};