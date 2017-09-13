export default {
  // Helper for next step
  // src: https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript
  arrayInArray(haystack, arr) {
      return arr.some(function (v) {
          return haystack.indexOf(v) >= 0;
      });
  }
}
