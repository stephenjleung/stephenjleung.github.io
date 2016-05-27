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
        var maleStartIndex = 0;
        var maleStartIndexFound = false;
        
        for (var i = 0; i < dataArr.length; i++) {
          tempObj = {};
          tempArr = dataArr[i].split(",");
          tempObj.name = tempArr[0];
          tempObj.gender = tempArr[1];
          tempObj.frequency = tempArr[2];
          
          // The csv file first lists females before the male list starts.
          // I reset the rank numbering system when we get to the boys during iteration.
          // Loading different year files will have the boys starting at a different index.
          if (maleStartIndexFound === false)
            if (tempObj.gender === "M") {
              maleStartIndex = i;
              maleStartIndexFound = true;
            }
          
          if (maleStartIndexFound === true)
            tempObj.rank = (i % maleStartIndex) + 1;
          else 
            tempObj.rank = i + 1;
          names2015.names.push(tempObj);
          }
          
        // Display some search results on page load
          searchTopNames("boy");
        }
      };
      xhttp.open("GET", filepath, true);
      xhttp.send();
  };
  
  csvToJSON(filepath3);
  
  // Function to get random baby names based on filters (API GET-request here)
  var getRandomNames = function(randomGender, originCode, num) {
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
    var apiLink = "http://www.behindthename.com/api/random.php?usage=" + originCode + "&number=" + num + "&gender=" + randomGender + "&key=st918764";
    xhttp.open("GET", apiLink, true);
    xhttp.send();
  };
  
  // Generates a list of names as buttons that you can add to favorites
  var generateNamesList = function(namesArray, targetID) {
    
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

  // Global variables to keep track of current search info to display proper results set.
  var searchResultsCount = 0;
  var currentSearchPage = 0;
  var resultsArr = [];
  var nameToSearch = "";
  var gender = "";
  var quickSearch = false;
  
  var resetGlobalSearchCounters = function() {
    searchResultsCount = 0;
    currentSearchPage = 0;
    resultsArr = [];
    nameToSearch = "";
    gender = "";
    quickSearch = false;
  };

  var searchTopNames = function(gen) {
    resetGlobalSearchCounters();
    emptyElementById("search-results-count");
    
    if (gen === "boy")
      gender = "M";
    else
      gender = "F";
    
    quickSearch = true;
    var tempArr = [];
    
    resultsArr = names2015.names.filter(function(name){
      if (name.gender === gender)
        return name;
    }).slice(0,100);
    
    searchResultsCount = resultsArr.length;
    tempArr = resultsArr.slice(currentSearchPage*10,currentSearchPage*10+10);
    document.getElementById("search-results-count").insertAdjacentHTML("beforeend", "<i> Displaying the top 100 most popular " + gen + " names</i>...");
    searchNames();
  };
  
  
  var searchNames = function() {
    if ((nameToSearch != "") || quickSearch) {
      
      if (!quickSearch) {
        var tempArr = [];
        resultsArr = names2015.names.filter(function(name){
          if ((name.gender === gender) && (name.name.toLowerCase().startsWith(nameToSearch)))
            return name;
        }).slice();
      }
      
      currentSearchPage = 0;
      searchResultsCount = resultsArr.length;
      
      if (searchResultsCount === 0)
        displayResultsCount(0);
      else
        if (searchResultsCount > 10) {
          displayResultsCount();
          tempArr = resultsArr.slice(currentSearchPage*10,currentSearchPage*10+10);
          generateNamesList(tempArr,"search-results");
        }
      else {
        displayResultsCount();
        generateNamesList(resultsArr,"search-results");
      }
    }
    else {
      resetGlobalSearchCounters();
      emptyElementById("search-results-count");
      emptyElementById("search-results");
    }
  };
  
  var changeSearchResultsPage = function(next) {
    // If the "next" button was clicked...
    if (next && (searchResultsCount / ((currentSearchPage+1)*10)>1)) {
      currentSearchPage++;
      var tempArr = resultsArr.slice(currentSearchPage*10,currentSearchPage*10+10);
      generateNamesList(tempArr,"search-results");
      displayResultsCount();
    }
    // If the previous button was clicked and you are not on the first page...
    else if (!next && currentSearchPage > 0) {
      currentSearchPage--;
      tempArr = resultsArr.slice(currentSearchPage*10,currentSearchPage*10+10);
      generateNamesList(tempArr,"search-results");
      displayResultsCount();
    }
  };
  
  var displayResultsCount = function () {
    if (gender === "M")
      var gen = "male";
    else
      gen = "female";
    
    if (quickSearch) {
      if (gender === "M")
        gen = "boy";
      else
        gen = "girl";
      emptyElementById("search-results-count");
      document.getElementById("search-results-count").insertAdjacentHTML("beforeend", "<i> Displaying the top 100 most popular baby " + gen + " names</i>...");
    }
    else
      emptyElementById("search-results-count");
    
    if (searchResultsCount === 0) {
      emptyElementById("search-results");
      document.getElementById("search-results-count").insertAdjacentHTML("beforeend", "<i><strong>0</strong> results for <strong>" + gen + "</strong> names beginning with <strong>" + nameToSearch + "</strong></i>...");
    }
    else
      if (searchResultsCount === 1)
        document.getElementById("search-results-count").insertAdjacentHTML("beforeend", "<i><strong>" +searchResultsCount + "</strong> result for <strong>" + gen + "</strong> names beginning with <strong>" + nameToSearch + "</strong></i>...");
    else
      if (searchResultsCount > 10) {
        if (!quickSearch)
          document.getElementById("search-results-count").insertAdjacentHTML("beforeend", "<i><strong>" + searchResultsCount + "</strong> results for <strong>" + gen + "</strong> names beginning with <strong>" + nameToSearch + "</strong></i>...");
        document.getElementById("search-results-count").insertAdjacentHTML("beforeend","<div id='search-nav'><button onclick='changeSearchResultsPage(false)' id='search-prev'>Prev</button> " + (currentSearchPage*10+1) + "-" + (currentSearchPage*10+10) + " <button onclick='changeSearchResultsPage(true)' id='search-next'>Next</button></div>");
      }
    else 
      document.getElementById("search-results-count").insertAdjacentHTML("beforeend", "<i><strong>" +searchResultsCount + "</strong> results for <strong>" + gen + "</strong> names beginning with <strong>" + nameToSearch + "</strong></i>...");
  };
  
  // Actions to be performed only after the window has loaded. Mostly event-listeners 
  window.onload = function(){
    
    // Action triggered when you click the "Search" button
    document.getElementById("search-submit").onclick = function() {
      quickSearch = false;
      gender = document.querySelector('input[name = "search-gender"]:checked').value;
      nameToSearch = document.getElementById("search-input").value.toLowerCase();
      if (nameToSearch != "")
        searchNames();
    };
    
    // Action triggered when you press any key within the "Search" input field.
    document.getElementById("search-input").onkeyup = function() {
      quickSearch = false;
      gender = document.querySelector('input[name = "search-gender"]:checked').value;
      nameToSearch = document.getElementById("search-input").value.toLowerCase();
      searchNames();
    };
    
    // Action triggered when toggling search gender
    document.getElementById("search-button-male").onclick = function() {
      gender = document.querySelector('input[name = "search-gender"]:checked').value;
      nameToSearch = document.getElementById("search-input").value.toLowerCase();
      if (nameToSearch != "")
        searchNames();
    };
    
    // Action triggered when toggling search gender
    document.getElementById("search-button-female").onclick = function() {
      gender = document.querySelector('input[name = "search-gender"]:checked').value;
      nameToSearch = document.getElementById("search-input").value.toLowerCase();
      if (nameToSearch != "")
        searchNames();
    };
    
    // Action triggered when "Get Random" button is clicked
    document.getElementById("random-button").onclick = function() {
      var randomGender = document.querySelector('input[name = "random-gender"]:checked').value;
      var originCode = document.getElementById("origin-dropdown").value;
      getRandomNames(randomGender,originCode,6);
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