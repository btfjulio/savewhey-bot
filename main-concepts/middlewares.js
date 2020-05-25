// middleware pattern (chain of reponsibility)

const exec = (exec, ...middlewares) => {
  const run = (index) => {
    middlewares &&
      index < middlewares.length &&
      middlewares[index](ctx, () => run(index + 1));
    // index value + 1 is to call the next function
    // it will call the next middleware on the chain
  };
  run(0);
  // triggers the chain execution process
};

const mid1 = (ctx, next) => {
  ctx.info1 = "mid1";
  next(); // passed as () => run(0 + 1)
  // call next function
};

const mid2 = (ctx, next) => {
  ctx.info2 = "mid2";
  next(); // passed as () => run(1 + 1)
  // call next function
};

const mid3 = (ctx) => (ctx.info3 = "mid3");
// the next function is not accepted as arg
// in the last call the function with run will not be executed 

const ctx = {};
exec(ctx, mid1, mid2, mid3);
console.log(ctx);
