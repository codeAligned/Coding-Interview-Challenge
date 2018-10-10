let axios = require('axios');
const baseURL = 'https://enigmatic-plains-7414.herokuapp.com/';


function convertStringMatrix(string) {
    var firstIndex = parseInt(string[1]);
    var middleIndex = string.indexOf(', ') + 2;
    var lastIndex = string.indexOf(']');
    var secondIndex = parseInt(string.substring(middleIndex, lastIndex));
    return [firstIndex, secondIndex];
}

function getPasswordatMatrix(matrixPosition, matrixtoSearch) {
    var startIndex = matrixtoSearch.length - 1;
    var row = startIndex - matrixPosition[1];
    var column = matrixPosition[0];
    return matrixtoSearch[row][column];
}


function hashMaptoString(hashMap) {
    var stringArray = [];
    for (var key in hashMap) {
        var value = hashMap[key];
        stringArray[key] = value;
    }
    return stringArray.join('');
}


function main() {
    console.log('Running. Takes a bit of time');
    axios.get(baseURL).then( (response) => {
        var allChunks = response.data;
        var line1 = true;
        var line2 = false;
        var oldi = 0;
        var matrixPosition = [];
        var password = {};
        var passwordindex = 0;
        var matrixtoSearch = [];
        var currentMatrixRow = 0;
        var i = 0;
        while (i < allChunks.length) {
            var char = allChunks[i];
            oldi = i;
            //Gets next Index
            i = allChunks.indexOf('\n', i) + 1;
            if (i === -1) {
                break;
            }
            if (line1) {
                passwordindex = parseInt(char);
                line1=false;
                line2 = true;
            } else if (line2) {        //Now next time, it will get next line, which will be line two. 
                var substring = allChunks.substring(oldi, i-1);
                line2 = false;
                matrixPosition = convertStringMatrix(substring);
            } else if (char === '\n') { //beginning of new chunk
                password[passwordindex] = getPasswordatMatrix(matrixPosition, matrixtoSearch);
                matrixPosition = [];
                matrixtoSearch = [];
                line1 = true;
            } else { //Keep going through the next indexes;
                var line = allChunks.substring(oldi, i-1);
                var toList = [...line];
                matrixtoSearch[currentMatrixRow] = toList;
                currentMatrixRow++;
            }
        }
        console.log('PASSWORD IS');
        console.log(hashMaptoString(password));

    }).catch((err) => console.log(err))
}

main();