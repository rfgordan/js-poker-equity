//imports
//var utils = require('./utils.js')
var csv = require('csv-parse');
var fs = require('fs');
var { GetPairString, GetSingleString, Nums2CardString, CardString2Num } =  require('./utils.js');

// map from card numbers to primes
// used to generate unique ids
var primemap = [2,3,5,7,11,13,17,19,23,29,31,37,41];

// load hand equivalence classes
function LoadData() {
  var eqtable,
    parsedtable,
    parsedline;
  fs.readFile('eqcllist', 'utf-8', (e, c) => {
    eqtable = c;
  });
  var parser = csv({delimiter: '\t'});
  parser.write(eqtable);
  while (parsedline = parser.read()) {
    parsedtable.push(parsedline);
  }
}



function DAGNode(prime) {
  this.next = new Array(13);
  this.uid = prime; // each node has a unique prime number
}

function DAG() {

  // root of the graph
  var root = new DAGNode(1);

  // flat dictionary of DAG nodes from layer i-1
  var last_nodes = { [ root.uid ] : root};

  // flat dictionary of DAG nodes from layer i
  var current_nodes = {};

  // declare outside of loop
  let next_uid = 0;
  let next_node;

  // loop over all seven layers
  for (let i = 0; i < 7; i++)
  {

    // loop over all nodes in current layer
    for (const [key, value] of Object.entries(last_nodes))
    {

      // generate each of the next 13 nodes
      for (let j = 0; j < 13; j++)
      {
        // unique prime id of next node
        next_uid = value.uid*primemap[j];

        // case if we've already generated the next node
        if (next_uid in current_nodes)
        {
          value.next[j] = current_nodes[next_uid];
        }

        // case if we haven't generated the next node
        else
        {
          next_node = new DAGNode(next_uid);
          value.next[j] = next_node;
          current_nodes[next_uid] = next_node;
        }
      }
    }

    // roll over our node tracking objects
    last_nodes = current_nodes;
    current_nodes = {};
  }

  // set hand equivalence values for the final layer


  return root;

}

// create map from 5 card string to equivalence class
function createmap () {
  var l;
  fs.readFile('eqclist', (err, data) => {l=data});
  const parser = csv({delimiter: '\t'});
  parser.write(l)
  // not sure if this syntax is right
  var hand;
  var map = {};
  while (hand=parser.read())
  {
    if (!(hand[1] in map) || +hand[0] > map[hand[1]])
      map[hand[1]] = hand[0]
  }

  return map;
}

// get hand equivalence class for 5 card hand
// ignore suit
// only used in precalc stage
// takes in list of 5 numbers and map from 5 card string to equivalence class
function eval5 (cards, map) {
  const cards_string = cards.reduce((acc, cur) => acc + Nums2CardString(cur), "");
  return map[cards_string];
}

// compare equivalence value of all combinations of cards, ignoring suits, return best
// only used in precalc stage
// takes in list of 7 numbers and map from 5 card string to equivalence class
function best_hand (cards, map) {
  cards = cards.sort()

  // generate each combination
  function* next_combo () {
    for (const i = 0; i < 6; i++)
    {
      for (const j = i+1; j<7; j++)
      {
        yield cards.slice(0,i) + cards.slice(i+1,j) + cards.slice(j+1,7);
      }
    }
  }

  const done = false;
  const next;
  const lowest = 8000; // the lowest eq value is the best 5 card hand
  const eqval;
  var gen = next_combo();
  while (!done)
  {
    next = gen.next();
    eqval = eval5(next.value, map);
    if (eqval < lowest)
      lowest = eqval;

    done = next.done;
  }

  return lowest;
}
