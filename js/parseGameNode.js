

function parseGameNode(gameNode) {
    uname = window.localStorage.getItem("userName");

    let parsedGameNode = {};

    // easy ones
    parsedGameNode["timeClass"] = gameNode.time_class;   
    parsedGameNode["gameUrl"] = gameNode.url;   
    parsedGameNode["fen"] = gameNode.fen;  
    parsedGameNode["timeStamp"] = utcToHuman(gameNode.end_time);
    
    let ogPgn = gameNode.pgn;
    let stripedPgn = ogPgn.replace(/(\r\n|\r|\n)/g,''); 
    parsedGameNode["pgn"] = stripedPgn;  

    parsedGameNode["ogPgn"] = gameNode.pgn;  

    // find game color
    if(gameNode.white.username.toUpperCase() == uname.toUpperCase()) {
        parsedGameNode["userColor"] = "white";
        parsedGameNode["result"] = gameNode.white.result;
        parsedGameNode["opponent"] = gameNode.black.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.black.username}`; 

        parsedGameNode["opponentRating"] = gameNode.black.rating;
        parsedGameNode["userRating"] = gameNode.white.rating;

        if (gameNode.hasOwnProperty("accuracies")) {
            parsedGameNode["userAccuracy"] = gameNode.accuracies.white;
            parsedGameNode["opponentAccuracy"] = gameNode.accuracies.black;
        }
        else {
            parsedGameNode["userAccuracy"] = "" ;
            parsedGameNode["opponentAccuracy"] = ""; 
        }

    }
    else {
        parsedGameNode["userColor"] = "black";
        parsedGameNode["result"] = gameNode.black.result;
        parsedGameNode["opponent"] = gameNode.white.username; 
        parsedGameNode["opponentUrl"] = `https://www.chess.com/member/${gameNode.white.username}`; 

        parsedGameNode["opponentRating"] = gameNode.white.rating;
        parsedGameNode["userRating"] = gameNode.black.rating;

        if (gameNode.hasOwnProperty("accuracies")) {
            parsedGameNode["userAccuracy"] = gameNode.accuracies.black;
            parsedGameNode["opponentAccuracy"] = gameNode.accuracies.white;
        }
        else {
            parsedGameNode["userAccuracy"] = "" ;
            parsedGameNode["opponentAccuracy"] = ""; 
        }

    }
    // pgn parsing
    let pgn = gameNode.pgn.split('\n');
    parsedGameNode["date"] = pgn[2].replace(/\\|\[|\]|\"|Date/g,'');
    parsedGameNode["openingUrl"] = pgn[10].replace(/\\|\[|\]|\"|ECOUrl/g,''); // sometimes returns utc timestamp

    let tmp_opening = pgn[10].replace(/\\|\[|\]|\"|ECOUrl|https:\/\/www.chess.com\/openings\//g,'');
    parsedGameNode["opening"] = tmp_opening.replace(/-/g," ");

    let mainLine = parsedGameNode["opening"].match(/^(\D*)(?=\d)/);
    if (mainLine){
        parsedGameNode["mainLineOpening"] = mainLine[1];
    }
    else {
        parsedGameNode["mainLineOpening"] = parsedGameNode["opening"]; 
    }

    parsedGameNode["startTime"] = pgn[17].replace(/\s|\[StartTime|\]|\"/g,'');
    parsedGameNode["endTime"] = pgn[19].replace(/\s|\[EndTime|\]|\"/g,'');

    // ugly  
    parsedGameNode["gameId"] = parsedGameNode["gameUrl"].match(/(live|daily)\/(.*)$/)[2];


    // main line openings 
    

    return parsedGameNode;
} 