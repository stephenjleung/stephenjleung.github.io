  //baby name api key st918764
  
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
  
  var originAndCode = {};
  var originAndDescription = {};
  var filepath1 = "resources/data/Origin-Code.csv";
  var filepath2 = "resources/data/Origin-Description.csv";
  
  // CSV parsing function to convert 2-column CSV file to object
  var csvToObject = function(filepath,obj){
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        // Action to be performed when the document is read;
        var dataStr = xhttp.responseText;
        var dataArr = dataStr.split("\n");
        
        for (var i = 0; i < dataArr.length; i++) {
          var firstColArr = [];
          var secondColArr = [];
          var firstColStr = "";
          var secondColStr = "";
          var firstColComplete = false;
          
          for (var j = 0; j < dataArr[i].length; j++) {
            if ((firstColComplete === true) && (dataArr[i][j] === '"')) {
              continue;
            }
            else
              if ((dataArr[i][j] == ",") && (firstColComplete === false)) {
                firstColComplete = true;
                continue;
              }
            else 
              if (firstColComplete === false)
                firstColArr.push(dataArr[i][j]);
            else
              secondColArr.push(dataArr[i][j]);
          }
          
          firstColStr = firstColArr.join("");
          secondColStr = secondColArr.join("");
          obj[firstColStr] = secondColStr;
          firstColArr = [];
          secondColArr = [];
          firstColStr = "";
          secondColStr = "";
          firstColComplete = false;  
          }
        }
      };
      xhttp.open("GET", filepath, false);
      xhttp.send();
  };
  
  csvToObject(filepath1, originAndCode);
  csvToObject(filepath2, originAndDescription);
  
  console.log(originAndCode);
  console.log(originAndDescription);
  
  
  // Function to get random baby names based on filters (API GET-request here)
  var getRandomNames = function(gender,num) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        
        // Action to be performed when the document is read;
        var data = xhttp.responseXML;
        var x = data.getElementsByTagName("name");
        var firstName = "";
        
        //Empties the list of random names in the DOM before generating a new list
        emptyElementById("random-names-list");
        
        // Generates the list of random names obtained from API call
        for (var i = 0; i < x.length; i++) {
          firstName = x[i].textContent;
          document.getElementById("random-names-list").insertAdjacentHTML("beforeend", "<li class='random-name'><h2><button class='btn btn-standard'>" + firstName + "</button><button onclick='addToFavorites(value)' class='btn btn-success btn-sm random-name-add' value='" + firstName + "'>Add to Favorites</button></h2>" + "</li>");
        }
      }
    };
  
    var apiLink = "http://www.behindthename.com/api/random.php?usage=eng&number=" + num + "&gender=" + gender + "&key=st918764";
    xhttp.open("GET", apiLink, true);
    xhttp.send();
  
  };
  
  // Function to add a name to favorites and update LocalStorage
  var addToFavorites = function(name) {
    if ((name != "") && (favorites.indexOf(name) < 0)) {
      favorites.push(name);
      saveToLocalStorage(favorites);
      document.getElementById("favorite-input").value = "";
      updateFavorites();
    }
  };
  
  // Function to remove a specific name from the favorites list
  var removeFromFavorites = function(name) {
    var index = favorites.indexOf(name);
    if (index > -1) {
      favorites.splice(index, 1);
      saveToLocalStorage(favorites);
      updateFavorites();
    }
  };
  
  // Function to refresh or reload the current Favorites list
  var updateFavorites = function() {
    emptyElementById("favorites-list");
    for (var i = 0; i < favorites.length; i++) {
      document.getElementById("favorites-list").insertAdjacentHTML("beforeend", "<li class='favorite-item'><h2><button class='btn btn-standard'>" + favorites[i] + "</button><button onclick='removeFromFavorites(value)' class='btn btn-danger favorite-remove btn-sm' value='" + favorites[i] + "'>Remove</button></h2>" + "</li>");
    }
  };
  
  // Function to update the LocalStorage value
  var saveToLocalStorage = function(favorites) {
    window.localStorage.setItem('_stephenjleung_favorites',JSON.stringify(favorites));
  };
  
    
  window.onload = function(){
    // Action triggered when "Get Random" button is clicked
    document.getElementById("random-button").onclick = function() {
      var gender = document.querySelector('input[name = "gender"]:checked').value;
      getRandomNames(gender,6);
    };
    
    // Action triggered when you click the "Add" to favorites button
    document.getElementById("favorite-button-add").onclick = function() {
      var nameToAdd = document.getElementById("favorite-input").value;
      addToFavorites(nameToAdd);
    };
    
    // Action triggered when you press Enter within the Favorites List input field
    document.getElementById("favorite-input").onkeypress = function(e) {
      if (e.which == 13) {
        var nameToAdd = document.getElementById("favorite-input").value;
        addToFavorites(nameToAdd);
      }
    };
  
    updateFavorites();
    getRandomNames("m",6);
    
    
    
    
  //var originAndDescription = {};
    
  };
  
  
  