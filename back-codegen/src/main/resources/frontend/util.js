/**
 * @param {Array} array
 */
const randomElementOfArray = array => array[Math.floor(Math.random() * array.length)];

/**
 *
 * @param str {string}
 * @returns {string}
 */
function removeAllSpaces(str) {
    return str.replace(/\s+/g, '');
}
function serverUrl(url){
    let domain = window.location.hostname;
    // Get the current URL
    return 'http://' + domain + ':19001'+url;
}
/**
 *
 * @param dsl {string}
 */
function downloadDocx(dsl){
    let domain = window.location.hostname;
    // Get the current URL
    let url = 'http://'+domain+':19001/docDsl';
    fetch(url, {
        method: 'POST',
        body: dsl
    })
        .then(response => response.blob())
        .then(blob => {
            // Create a blob URL
            let url = window.URL.createObjectURL(blob);
            // Create a link and programmatically click it to download the file
            let a = $('<a />', {
                href: url,
                download: '1.docx'
            }).appendTo('body');
            a[0].click();
            a.remove();
        })
        .catch((error) => console.error('Error:', error));

}

function extractChineseCharacters(inputString) {
    let chineseCharacters = inputString.match(/[\p{Script=Han}]/gu);
    return chineseCharacters ? chineseCharacters.join('') : '';
}

function extractEnglishCharacters(inputString) {
    let englishCharacters = inputString.match(/[a-z_A-Z\s]/g);
    return englishCharacters ? englishCharacters.join('') : '';
}

function extractNumbers(inputString) {
    let numbers = inputString.match(/\d+/g);
    return numbers ? numbers.join('') : '';
}
function splitBySpaces(inputString) {
    return inputString.split(/\s+/);
}

/**
 * 分离中英文 name id
 * @param input {string}
 * @returns {{name: (string|null), id: (string|null)}}
 */
function matchIdName(input) {
    let regex = /([\u4e00-\u9fa5]+)([a-zA-Z0-9.-_]+)/; // Matches Chinese characters followed by English characters
    let match = input.match(regex);

    return {
        name: match ? match[1] : null,
        id: match ? match[2] : null
    };
}