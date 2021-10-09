/*
 Algorithm for finding the k-th even natural (incl 0) number
 Algorithm 1:   Even(positive integer k)
Input: k , a positive integer (>=1)
Output: k-th even natural number (the first even being 0)
*/

// what is the 4th even natural number?
// 0, 2, 4, 6. 6 is the 4th even natural number.

const Even = (k, acc) => {
  console.log("Even k:", k);
  if (k === 1) return Promise.resolve(0);

  return new Promise((resolve) => {
    resolve(
      Even(k - 1).then((resp) => {
        console.log("_resp:", resp);
        return resp + 2;
      })
    );
  });
};

const x = Even(4);

x.then((resp) => {
  console.log("RESP:", resp);
});

// factorial
let getFactorial = (n) => {
  console.log("getFactorial n:", n);
  if (n <= 1) {
    return Promise.resolve(1);
  }

  return new Promise((resolve, reject) => {
    resolve(
      getFactorial(n - 1).then((fact) => {
        console.log("FACT:", fact, " n:", n);
        return fact * n;
      })
    );
  });
};
/*
getFactorial(3).then((resp) => {
  console.log("Got resp :", resp);
});
*/
