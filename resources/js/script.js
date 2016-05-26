  //baby name api key st918764
  
  // Loads a saved or default Favorites list
  if (Boolean(window.localStorage._stephenjleung_favorites))
    var favorites = JSON.parse(window.localStorage.getItem('_stephenjleung_favorites'));
  else
    favorites = ["Dave", "John", "Sarah","Brittany"];
  
  // Helper function to empty html contents by element ID
  var emptyElementById = function(id) {
    var node = document.getElementById(id);
        while (node.hasChildNodes()) {
          node.removeChild(node.firstChild);
        }
  };
  
  // Loads the origin dropdown.  Utilizes the object created from the csvToObject function.  The Origin list is stored locally as a csv.
  var loadOriginDropdown = function() {
    for (var i in originAndCode) {
      document.getElementById("origin-dropdown").insertAdjacentHTML("beforeend","<option value='" + originAndCode[i] + "'>" + i + "</option>");
    }
  };
  
  // Updates the Origin description in Random Generator area
  var updateOriginDescription = function(origin) {
    document.getElementById("origin-description").innerHTML = originAndDescription[origin];
  };
  
  var originAndCode = {};
  var originAndDescription = {};
  var filepath1 = "resources/data/Origin-Code.csv";
  var filepath2 = "resources/data/Origin-Description.csv";
  
  // CSV parsing function to convert 2-column LOCAL CSV file to object
  
  var csvToObject = function(filepath, obj){
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
          
        // After parsing is complete, load the items dependent on the CSV file data.
        loadOriginDropdown();
        updateOriginDescription("English");
        }
      };
      xhttp.open("GET", filepath, true);
      xhttp.send();
  };
  
  csvToObject(filepath1, originAndCode);
  csvToObject(filepath2, originAndDescription);
  
  
  var filepath3 = "resources/data/yob2015.csv";
  var names2015 = {"names":[]};
  
  // Converts a 2015 US Census csv file containing over 30,000 names into JSON format.
  // Final JSON object is stored in the variable names2015.
  
  var csvToJSON = function(filepath){
    
    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        // Action to be performed when the document is read;
        var dataStr = xhttp.responseText;
        var dataArr = dataStr.split("\n");
        var tempArr = [];
        var tempObj = {};
        
        for (var i = 0; i < dataArr.length; i++) {
          tempObj = {};
          tempArr = dataArr[i].split(",");
          tempObj.name = tempArr[0];
          tempObj.gender = tempArr[1];
          tempObj.frequency = tempArr[2];
          // The csv file first lists 18993 females before the male list starts.
          // Starting a new rank numbering system when we get to the boys.
          tempObj.rank = (i % 18993) + 1;
          names2015.names.push(tempObj);
          }
        }
      };
      xhttp.open("GET", filepath, true);
      xhttp.send();
  };
  
  csvToJSON(filepath3);
  
  // Function to get random baby names based on filters (API GET-request here)
  var getRandomNames = function(gender,originCode,num) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        
        // Action to be performed when the document is read;
        var data = xhttp.responseXML;
        var x = data.getElementsByTagName("name");
        var namesArr = [];
        
        // Generates the list of random names obtained from API call
        for (var i = 0; i < x.length; i++) {
          namesArr.push(x[i].textContent);
        }
        generateNamesList(namesArr,"random-names-list");
      }
    };
    // The API call
    var apiLink = "http://www.behindthename.com/api/random.php?usage=" + originCode + "&number=" + num + "&gender=" + gender + "&key=st918764";
    xhttp.open("GET", apiLink, true);
    xhttp.send();
  };
  
  // Generates a list of names as buttons that you can add to favorites
  var generateNamesList = function(namesArray,targetID) {
    
    if (typeof(namesArray[0]) === "string"){
      emptyElementById(targetID);
      var firstName = "";
      // Generates the list of random names obtained from API call
      for (var i = 0; i < namesArray.length; i++) {
        firstName = namesArray[i];
        document.getElementById(targetID).insertAdjacentHTML("beforeend", 
          "<li class='button-name'><h2><button class='btn btn-standard'>" + firstName + 
          "</button><button onclick='addToFavorites(value)' class='btn btn-success btn-sm button-name-add' value='"
          + firstName + "'>Add to Favorites</button></h2>" + "</li>");
      }
    }
    // This means we have an array of name objects; not just first name strings.
    else {
      emptyElementById(targetID);
      var firstName = "";
      var rank = 0;
      for (var i = 0; i < namesArray.length; i++) {
        firstName = namesArray[i].name;
        rank = namesArray[i].rank;
        document.getElementById(targetID).insertAdjacentHTML("beforeend", 
          "<li class='button-name'><h2><button class='btn btn-default rank'>" + "Rank: " + rank + 
          "</button><button class='btn btn-standard'>" + firstName + 
          "</button><button onclick='addToFavorites(value)' class='btn btn-success btn-sm button-name-add' value='"
          + firstName + "'>Add to Favorites</button></h2>" + "</li>");
      }
      
    }
    
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
      document.getElementById("favorites-list").insertAdjacentHTML("beforeend", "<li class='favorite-item'><h2><button class='btn btn-standard'>"
        + favorites[i] + "</button><button onclick='removeFromFavorites(value)' class='btn btn-danger favorite-remove btn-sm' value='"
        + favorites[i] + "'>Remove</button></h2>" + "</li>");
    }
  };
  
  // Function to update the LocalStorage value
  var saveToLocalStorage = function(favorites) {
    window.localStorage.setItem('_stephenjleung_favorites',JSON.stringify(favorites));
  };
  

  var searchTopTenGirlNames = function() {
    var tempArr = names2015.names.filter(function(name){
      if (name.gender == "F")
        return name;
    });
    var finalArr = [];
    for (var i = 0; i < 10; i++) {
      finalArr.push(tempArr[i]);
    }
    generateNamesList(finalArr,"search-results");
  };
  
  var searchTopTenBoyNames = function() {
    var tempArr = names2015.names.filter(function(name){
      if (name.gender == "M")
        return name;
    });
    var finalArr = [];
    for (var i = 0; i < 10; i++) {
      finalArr.push(tempArr[i]);
    }
    generateNamesList(finalArr,"search-results");
  };

  
  // Actions to be performed only after the window has loaded  
  window.onload = function(){
    // Action triggered when "Get Random" button is clicked
    document.getElementById("random-button").onclick = function() {
      var gender = document.querySelector('input[name = "random-gender"]:checked').value;
      var originCode = document.getElementById("origin-dropdown").value;
      getRandomNames(gender,originCode,6);
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

    // Populate favorites list on page load
    updateFavorites();
    
    // Populate initial random names (default filters)
    getRandomNames("m","eng",6);
    
    
    
  };