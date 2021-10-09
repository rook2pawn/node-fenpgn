const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const work = (x) => {
  return x;
};

const left = x.slice(0, x.length / 2);
const right = x.slice(x.length / 2 + 1);
console.log("left:", left, "right:", right);
let globalTally = 0;
const tally = (val) => {
  globalTally += val;
  console.log("Val:", val, "globalTally:", globalTally);
};
const chain = (list) => {
  return list
    .reduce((acc, cv) => {
      return acc.then((a) => {
        console.log(`${cv >= 7 ? "Right" : "Left"} Work a:${a}  cv: ${cv}`);
        return Promise.resolve(work(a + cv));
      });
    }, Promise.resolve(0))
    .then((y) => {
      tally(y);
    });
};

Promise.all([chain(left), chain(right)]).then(() => {
  console.log("Finished");
});
