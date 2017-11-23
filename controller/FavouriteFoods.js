var rest = require('../API/Restclient');

exports.displayFavouriteFood = function getFavouriteFood(session, username){
    var url = 'http://health-chatbot.azurewebsites.net/tables/testtable';
    
    rest.getFavouriteFood(url, session, username, handleFavouriteFoodResponse)
};

exports.sendFavouriteFood = function postFavouriteFood(session, username, favouriteFood){
    var url = 'http://health-chatbot.azurewebsites.net/tables/testtable';
    rest.postFavouriteFood(url, username, favouriteFood, testCurrencyFunction);
};

function testCurrencyFunction(){
    console.log('Hi!');
    var from="USD", to="AED";
    var url = "http://apilayer.net/api/live?access_key=8db6106aae6236f2cee4620f4965f956"
                // +"&source="+from 
                +"&currencies="+to;
    rest.getCurrencyRate(url, displayCurrency)
    
}

function displayCurrency(body) {
    console.log(body);
    
}

function handleFavouriteFoodResponse(message, session, username) {
    var favouriteFoodResponse = JSON.parse(message);
    console.log(favouriteFoodResponse);
     
    var allFoods = [];
    
    for (var index in favouriteFoodResponse) {
        var usernameReceived = favouriteFoodResponse[index].name;
        var favouriteFood = favouriteFoodResponse[index].favFood;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
             //Add a comma after all favourite foods unless last one
            if(favouriteFoodResponse.length - 1) {
                allFoods.push(favouriteFood);
            }
            else {
                allFoods.push(favouriteFood + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your favourite foods are: %s", username, allFoods);                
    
}

exports.deleteFavouriteFood = function deleteFavouriteFood(session,username,favouriteFood){
    var url  = 'http://health-chatbot.azurewebsites.net/tables/testtable';

    rest.getFavouriteFood(url,session, username,function(message,session,username){
     var   allFoods = JSON.parse(message);
        console.log(allFoods);
        
        for(var i in allFoods) {
            session.send("matching: " + allFoods[i].favFood +", with: "+ favouriteFood +" and matching: "+ allFoods[i].name +", with: "+ username);
            if (allFoods[i].favFood === favouriteFood && allFoods[i].name === username) {
                console.log(allFoods[i]);
                rest.deleteFavouriteFood(url,session,username,favouriteFood, allFoods[i].id ,handleDeletedFoodResponse)
            }
        }
    });
};

function handleDeletedFoodResponse(body,session,username, favouriteFood) {
    console.log('done');
    
}