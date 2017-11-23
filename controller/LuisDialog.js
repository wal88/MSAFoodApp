var builder = require('botbuilder');
var FavouriteFoodJs = require('./FavouriteFoods'); // was food
var RestaurantCardJs = require('./RestaurantCard'); //was restaurant
var NutritionCardJs = require('./NutritionCard');  // was nutrition

exports.startDialog = function(bot){
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1ee31605-f5ee-4a65-b545-8ea148c9c31e?subscription-key=7f8105988bb944b1a97f266d314f52eb&verbose=true&timezoneOffset=0&q=')
    bot.recognizer(recognizer);
    
    

    bot.dialog('AddUsername', function(session, args){
        session.send("AddUsername");
      
    }).triggerAction({
        matches: 'AddUsername'
    });

    bot.dialog('DeleteFavourite', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            if (results.response) {                    
                session.conversationData["username"] = results.response;
            }
            session.send("You want to delete one of your favourite foods.");

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Deleting \'%s\'...', foodEntity.entity );
                FavouriteFoodJs.deleteFavouriteFood(session,session.conversationData['username'],foodEntity.entity); //<--- CALLL WE WANT
            } else {
                session.send("No food identified! Please try again");
            }
    }]).triggerAction({
        matches: 'DeleteFavourite'
    });

    bot.dialog('GetFavouriteFood', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
                if (results.response) {                    
                    session.conversationData["username"] = results.response;
                }
                session.send("Retrieving your favourite foods");
                FavouriteFoodJs.displayFavouriteFood(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
        }
      
    ]).triggerAction({
        matches: 'GetFavouriteFood'
    });

    bot.dialog('AddFavourite', [
        function (session, args, next) {   
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {

                if (results.response) {
                    session.conversationData["username"] = results.response;
                }
                // Pulls out the food entity from the session if it exists
                var foodEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'food');
    
                // Checks if the food entity was found
                if (foodEntity) {
                    session.send('Thanks for telling me that \'%s\' is your favourite food', foodEntity.entity);
                    FavouriteFoodJs.sendFavouriteFood(session, session.conversationData["username"], foodEntity.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("No food identified!!!");
                }
        }
    ]).triggerAction({
        matches: 'AddFavourite'
    });

    bot.dialog('WantFood', function (session, args) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Looking for restaurants which sell %s...', foodEntity.entity);
                RestaurantCardJs.displayRestaurantCards(foodEntity.entity, "auckland", session);
            } else {
                session.send("No food identified! Please try again");
            }
    }).triggerAction({
        matches: 'WantFood'
    });


    bot.dialog('WelcomeIntent', function(session, args){
        session.send("WelcomeIntent");
      
    }).triggerAction({
        matches: 'WelcomeIntent'
    });

    bot.dialog('GetCalories', function (session, args) {

            // Pulls out the food entity from the session if it exists
            var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

            // Checks if the for entity was found
            if (foodEntity) {
                session.send('Calculating calories in %s...', foodEntity.entity);
                NutritionCardJs.displayNutritionCards(foodEntity.entity, session);

            } else {
                session.send("No food identified! Please try again");
            }
    }).triggerAction({
        matches: 'GetCalories'
    });

    
}