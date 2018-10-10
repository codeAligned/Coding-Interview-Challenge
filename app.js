//Password is: f3rn3t
let axios = require('axios');
const baseURL = 'https://enigmatic-hamlet-4927.herokuapp.com/posse';


var ALL_CASES = {
    Upper: 0,
    Lower: 1,
    Umlaut: 2
};

class ListofThrees {
    constructor() {
        this.list = [];
    }
}

function prefixofLetters(possiblePosse) {
    var first = possiblePosse[0];
    var second = possiblePosse[1];
    var third = possiblePosse[2];
    if (getPrefix(first) !== getPrefix(second) && getPrefix(first) !== getPrefix(third) && getPrefix(second) !== getPrefix(third)) {
        return true;
    } else if (getPrefix(first) === getPrefix(second) && getPrefix(first) === getPrefix(third) && getPrefix(second) === getPrefix(third)) {
        return true;
    }
    return false;
}

function getPrefix(string) {
    return string[0];
}

function whichLetter(possiblePosse) {
    var first = possiblePosse[0];
    var second = possiblePosse[1];
    var third = possiblePosse[2];
    if (getLetter(first) !== getLetter(second) && getLetter(first) !== getLetter(third) && getLetter(second) !== getLetter(third)) {
        return true;
    } else if (getLetter(first) === getLetter(second) && getLetter(first) === getLetter(third) && getLetter(second) === getLetter(third)) {
        return true;
    }
    return false;
}

function getLetter(letter) {
    letter = letter[1];
    letter = letter.toLowerCase();
    if (!letter.match(/^[0-9a-zA-Z]+$/)){
        if (letter === 'ä') {
            return 'a';
        } else if (letter === 'ö') {
            return 'o';
        } else if (letter === 'ü') {
            return 'u';
        }
    }
    return letter;
}


//You can make the assumption here that each individual index will either be ALL lowercase, ALL uppercase, or ALL umlauts
function caseofLetters(possiblePosse) {
    var first = possiblePosse[0];
    var second = possiblePosse[1];
    var third = possiblePosse[2];
    if (getCase(first) !== getCase(second) && getCase(first) !== getCase(third) && getCase(second) !== getCase(third)) {
        return true;
    } else if (getCase(first) === getCase(second) && getCase(first) === getCase(third) && getCase(second) === getCase(third)) {
        return true;
    }
    return false;
}

//Assume string is always first index.
function getCase(string) {
    var getChar = string[1];
    if(!getChar.match(/^[0-9a-zA-Z]+$/)) {
        return ALL_CASES.Umlaut;

    }else if (getChar === getChar.toUpperCase()) {
        return ALL_CASES.Upper;
    } else if (getChar === getChar.toLowerCase()) {
        return ALL_CASES.Lower;
    }
}

//You know all of are size 3, returns true if all different, or all not different
function numberofLetters(possiblePosse) {
    var first = possiblePosse[0];
    var second = possiblePosse[1];
    var third = possiblePosse[2];
    if (first.length !== second.length && first.length !== third.length && second.length !== third.length) {
        return true;
    } else if (first.length === second.length && first.length === third.length && second.length === third.length) {
        return true;
    }
    return false;
}


function recurseDistinctCombinations(array, out, i, n, k, listofthree) {

    if(k === 0) {
        listofthree.list.push(out);
        return;
    }
    // start from next index till last index
    for (var j = i; j < n; j++) {
        var newArray = [...out];
        newArray.push(array[j]);
        recurseDistinctCombinations(array, newArray, j+1, n, k-1, listofthree)
    }
}

function recurseDistinctCombinationHelper(inputArray) {
    var listofthree = new ListofThrees();
    recurseDistinctCombinations(inputArray, [], 0, inputArray.length, 3, listofthree);
    return listofthree.list;
}



class HttpRequest {
    static getRequest(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + url, {params: params}).then( (response) => resolve(response)).catch((err) => reject(err));
        });
    }
    static postRequest(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(baseURL + url, params).then( (response) => resolve(response)).catch((err) => reject(err));
        });
    }
}
function main() {
    solveGame();
}

function getPosseFunc(input) {
    return new Promise((resolve, reject) => {
        var allDistinctCombinationsofThree = recurseDistinctCombinationHelper(input);
        for (var i = 0; i < allDistinctCombinationsofThree.length; i++) {
            var possiblePosse = allDistinctCombinationsofThree[i];
            if (prefixofLetters(possiblePosse) && numberofLetters(possiblePosse) && caseofLetters(possiblePosse) && whichLetter(possiblePosse)) {
                resolve(possiblePosse);
            }
        }
        reject();
    });
   
}

async function solveGame() {
    getInitialBoard().then(async (data) => {
        var getPosse = await getPosseFunc(data.board);
        var id = data.id;
        var postValue = {"posse": getPosse};
       WinGame(id, postValue);
        
    });
}

async function WinGame(id, postValue) {
    HttpRequest.postRequest('/' + id.toString(), postValue).then(async (response) => {
        if (response.data.hasOwnProperty('password')) {
            console.log('WON THE GAME!');
            console.log(response.data.password);
            keepSolving = false;
        } else {
            var getPosse = await getPosseFunc(response.data.board);
            postValue = {"posse": getPosse};
            return WinGame(id, postValue);
        }
    }).catch((err) => console.log(err));
}

function getInitialBoard() {
    return new Promise((resolve, reject) => {
        HttpRequest.postRequest('', null).then((response) => { 
            console.log(response.data);
            resolve(response.data);
        }).catch((err) => reject(err));
    });
    
}



function test() {
    var testCorrect = ['a', 'bb', 'ccc'];
    var testCorrect2 = ['a', 'b', 'c'];
    var testIncorrect1 = ['a', 'aa', 'bb'];
    console.log(numberofLetters(testCorrect) === true);
    console.log(numberofLetters(testCorrect2) === true);
    console.log(numberofLetters(testIncorrect1) === false);
    var upperCase = '+AAA';
    var lowerCase = '-abc';
    var umlaut = '+ü'
    console.log(getCase(upperCase) === ALL_CASES.Upper);
    console.log(getCase(lowerCase) === ALL_CASES.Lower);
    console.log(getCase(umlaut) === ALL_CASES.Umlaut);
    var caseTestCorrect = ['+ÖÖÖ', '=aaa', 'AAA'];
    var caseTestSame = ['AAA', 'BBB', 'CCC'];
    var caseTestIncorrect = ['+ÖÖÖ', '=aaa', '=ccc'];
    console.log(caseofLetters(caseTestCorrect) === true);
    console.log(caseofLetters(caseTestSame) === true);
    console.log(caseofLetters(caseTestIncorrect) === false);
    var getLetterTestTransformation = '-Ö';
    console.log(getLetter(getLetterTestTransformation) === 'o');

}

main();