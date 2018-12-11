//imports
//var utils = require('./utils.js')
var csv = require('csv-parse');
var fs = require('fs');

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
