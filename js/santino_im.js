/* Funciones básicas con JavaScript
 *
 *
 * Santino Matias Im
*/

"use strict";

export function firstNonRepeating(text){
    if (text.length === 0){
        return undefined;
    }
    for (let i = 0; i<text.length; i++){
        let character = text[i];
        if (text.indexOf(character) === text.lastIndexOf(character)){
            return character;
        }
    }
    return "";
}

export function bubbleSort(array){
    let n = array.length;
    for (let i = 0; i < n; i++){
        for (let j = 0; j < n - 1 - i; j++){
            if (array[j] > array[j+1]){
                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }
        }
    }
    return array;
}

export function invertArray(array){
    let resultArray = [];
    for (let i = array.length - 1; i >= 0; i--){
        resultArray.push(array[i]);
    }
    return resultArray;
}

export function invertArrayInplace(array){
    let n = array.length;
    for (let i = 0; i < Math.floor(n/2); i++){
        let temp = array[i];
        array[i] = array[n - i - 1];
        array[n - i - 1] = temp;
    }
    return array;
}

export function capitalize(text){
    if (typeof text !== "string"){
        return "";
    }
    return text.split(" ")
    .map(palabra =>{
         let n = palabra.length;
    if (n === 0){
        return palabra;
    }
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
}

export function mcd(a, b){
    if(b === 0 ){
        return a;
    }
    return mcd (b, a % b);


}

export function hackerSpeak(text){
    return text.replaceAll('a', '4').replaceAll('A', '4').replaceAll('e', '3').replaceAll('E', '3').replaceAll('i', '1').replaceAll('I', '1').replaceAll('o', '0').replaceAll('O', '0').replaceAll('s', '5').replaceAll('S', '5');
}

export function factorize(num){
    let factors = [];
    if (num === 0){
        return factors;
    }
    for (let i = 0; i <= num; i++){
        if (num % i === 0){
            factors.push(i);
        }
    }
    return factors;
}

export function deduplicate(array){
    return [... new Set(array)];
}

export function findShortestString(array){
    let n = array.length;
    if(n === 0){
        return 0;
    }
    let shortestString = array[0];
    for(let i = 1; i < n; i++){
        if (array[i].length < shortestString.length){
            shortestString = array[i];
        }

    }
    return shortestString.length;
}

export function isPalindrome(text) {
    const normalizedText = text.toLowerCase().replace(/\s/g, '');
    const reversedText = normalizedText.split('').reverse().join('');
    
    return normalizedText === reversedText;
  }

export function sortStrings(array) {
    if (!array || array.length === 0) {
      return [];
    }
    const sortedArray = [...array];
    return sortedArray.sort();
}

export function stats(array){
    
    let n = array.length;
    bubbleSort(array);
    if (!array || array.length === 0) {
        return [0, 0];
    }
    let sum = 0;
    for (let i = 0; i < n; i++){
        sum += array[i]

    }
    let mean = sum/n;
    const frequencyMap = {};
    let maxFrequency = 0;
    let mode = array[0];
    
    for (const num of array) {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
        
        if (frequencyMap[num] > maxFrequency) {
            maxFrequency = frequencyMap[num];
            mode = num;
        }
    }
    
    return [mean, mode];
}

export function popularString(text) {
    if (!text || text.length === 0) {
      return '';
    }
    
    const frequency = {};
    let maxFrequency = 0;
    let mostPopular = text[0];
    
    for (const str of text) {
      frequency[str] = (frequency[str] || 0) + 1;
      
      if (frequency[str] > maxFrequency) {
        maxFrequency = frequency[str];
        mostPopular = str;
      }
    }
    
    return mostPopular;
  }

export function isPowerOf2(num) {
    if (num <= 0) {
      return false;
    }
    return (num & (num - 1)) === 0;
  }

export function sortDescending(array) {
    if (!array || array.length === 0) {
      return [];
    }
    const sortedArray = [...array];
    return sortedArray.sort((a, b) => b - a);
}
