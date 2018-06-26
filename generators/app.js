
function* foo() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  
  for (const val of foo()) {
    console.log(val);
  }
  // a
  // b
  // c
  
  const [...values] = foo();
  console.log(values); // ['a','b','c']

  function* crossBridge() {
    const reply = yield "who your favorite civil engineer?"
    console.log('*after yield: ', reply);
    return reply === "Michael O'shaughnessy" ? 'You may pass' : 'WRONG'    
  }


// ROUND 1
  const iter1 = crossBridge()

  const q1 = iter1.next().value

  console.log(q1);

  const a1 = iter1.next('Michael Herman').value

  console.log('a1', a1)

// ROUND 2
  const iter2 = crossBridge()

  const q2 = iter2.next().value

  console.log(q2);

  const a2 = iter2.next("Michael O'shaughnessy").value

  console.log('a2', a2)

// FORCE RETURN
  const forcing = crossBridge()

  const forced = forcing.return()

  console.log('forced',forced);
  
// THROW ERROR
  // const throwing = crossBridge()

  // const error = new Error('its been thrown')
  
  // const threw = throwing.throw(error)

// FETCHING SOEMTHING?
 

  const isPromise = obj => Boolean(obj) && typeof obj.then === 'function';

  const callbacks = (item) => console.log(item)

  const next = (iter, callbacks, prev = undefined) => {
    const item = iter.next(prev);
    const value = item.value;
    if (item.done) return onCompleted();
    
    if (isPromise(value)) {
      value.then(val => {
        onNext(val);
        setImmediate(() => next(iter, callbacks, val));
      });
    } else {
      onNext(value)
      setImmediate(() => next(iter, callbacks, value));
    }
  };

  const gensync = (fn) => (...args) => ({
    subscribe: (onNext, onError, onCompleted) => {
      next(fn(...args), { onNext, onError, onCompleted });
    }
  });

  const fetchSomethings = () => new Promise((resolve) => {
    setTimeout(() => resolve('the future'), 1000)
  })

  const myFunc = function* (param1, param2, param3) {
    const result = yield fetchSomethings(); // returns promise
  
    // waits for promise and uses promise result
    yield result + ' 2';
    yield param1;
    yield param2;
    yield param3;
  }

  const onNext = val => console.log('val', val);
  const onError = err => console.log(err);
  const onCompleted = () => console.log('done.');

  const asyncFunc = gensync(myFunc);

  asyncFunc('a param', 'another param', 'more params!')
    .subscribe(onNext, onError, onCompleted)


  