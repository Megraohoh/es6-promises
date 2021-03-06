// Use AJAX | Promises to load all 3 JSON files
// Iterate over all JSON files and match the human with their appropriate pet(s)
// ES6-ify it all!

$(document).ready(function(){

	var outputContainer = $("#output");

		var writeToDOM = function (humanArray) {
		  	var domString = "";
		  	for (var i = 0; i < humanArray.length; i++) {
			    domString += `<div class="human row">`;
			    domString += `<div class="col-sm-4">`;
			    domString += `<img src="${humanArray[i].image}">`;
			    domString += `<p>${humanArray[i].name}</p>`;
			    domString += `</div>`;
			    domString += `<div class="col-sm-8 overflow-row">`;

		    	for (var j = 0; j < humanArray[i].matches.length; j++){
			      domString += `<div class="animal">`;
			      domString += `<img src="${humanArray[i].matches[j].image}">`;
			      domString += `<p>${humanArray[i].matches[j].name}</p>`;
			      domString += `<p>${humanArray[i].matches[j].description}</p>`;
			      domString += `</div>`;
		    	}
		    domString += `</div>`;
		    domString += `</div>`;
  		  }
  		    outputContainer.append(domString);
		};

    var loadHumans = function () {
        return new Promise(function(resolve, reject) {
            $.ajax("./database/humans.json")
            .done(function(data1){
                resolve(data1.humans);
            })
            .fail(function(error){
                reject(error);
            });
        });
    };

    var loadDogs = function () {
        return new Promise(function(resolve, reject) {
            $.ajax("./database/dogs.json")
            .done(function(data1){
                resolve(data1.dogs);
            })
            .fail(function(error){
                reject(error);
            });
        });
    };

    var loadCats = function () {
        return new Promise(function(resolve, reject) {
            $.ajax("./database/cats.json")
            .done(function(data1){
                resolve(data1.cats);
            })
            .fail(function(error){
                reject(error);
            });
        });
    };

    var loadDinos = function () {
        return new Promise(function(resolve, reject) {
            $.ajax("./database/dinos.json")
            .done(function(data1){
                resolve(data1.dinos);
            })
            .fail(function(error){
                reject(error);
            });
        });
    };

    var myHumans = [];
    var myAnimals = [];

    var checkForTypeMatch = function(human, pet){
    	var interestedInArray = human["interested-in"];
    	var isMatchNumber = interestedInArray.indexOf(pet.type);
    	if (isMatchNumber === -1) {
    		return false;
    	} else {
    		return true;
    	}
    };

    var checkForKidFriendly = function(human, pet){
    	var hasKids = human["has-kids"];
    	var isKidFriendly = pet["kid-friendly"];
    	var isMatched = true;
    	if (hasKids && !isKidFriendly){  // ! means not
    		isMatched = false;
    	}
    	return isMatched;
    };

	    loadHumans().then(function(humans){ //for the array reference
	        humans.forEach(function(human){ //one instance for the foreach
	        	human.matches = [];
	            myHumans.push(human);
	        });
	            Promise.all([loadDogs(), loadCats(), loadDinos()])
	    		.then(function(result){
	    			result.forEach(function(xhrCall){
	    				xhrCall.forEach(function(animal){
	    					myAnimals.push(animal);
	    		});
	    	});
	        // console.log("myHumans", myHumans);
    			for (var i = 0; i < myHumans.length; i++){
    				for (var j = 0; j < myAnimals.length; j++) {
    					// console.log("myHumans", myHumans[i]);
    					if (checkForTypeMatch(myHumans[i], myAnimals[j]) && checkForKidFriendly(myHumans[i], myAnimals[j])) {
    						myHumans[i].matches.push(myAnimals[j]);
    					}
    				}
    			}
    		writeToDOM(myHumans);	
	    }) //no semicolon needed since the method catch is chaining to the for loops
	    		.catch(function(errors){
	    			console.log(errors);
	    		});
	   	
    })
	.catch(function(humanError){
		console.log(humanError);
	});    





















});