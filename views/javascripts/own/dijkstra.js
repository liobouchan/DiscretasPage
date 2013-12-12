var dijkstraAppModule  = angular.module('dijkstraApp', []);

dijkstraAppModule.controller('DijkstraController', dijkstraController);

dijkstraController.$inject = ['$scope'];
function dijkstraController( scope ){

  scope.answer = [];
  scope.nodes = 0;
  scope.list = [];

  scope.temporal = {
    from: 0,
    to: 0,
    weight: 0
  };

  scope.connections = [];
  
  scope.addConnection = function () {
    scope.connections.push(scope.temporal);

    scope.list[scope.temporal.from].push(scope.temporal.to);
    scope.temporal = {
      from: 0,
      to: 0,
      weight: 0
    };
  };

  scope.setNodes = function () {
    var i = 0, len = scope.nodes;
    
    for (i = 0; i < len; i++ ){
      scope.list.push([]);
    }
  };

  scope.dijkstra = function () {
    dijkstra( scope );
  };
}

function dijkstra ( scope ) {
  var i = 0,
      nodesLength = scope.nodes,
      indexes = [],
      minor,
      weights = [ 0 ];

  for ( i = 1; i < nodesLength; i++) {
    indexes.push( i );
    if ( contains( scope.list[0], i ) ){
      weights.push( searchWeight( scope.connections, 0, i ) );
    } else {
      weights.push( Infinity );
    }
  }

  for ( i = 1; i < nodesLength; i++) {
    minor = minInArray( temporalWeights ( indexes, weights ) );
    scope.list[indexOf(weights,minor.value)].forEach( 
      function ( element, index, array ) {
        weights[element] = Math.min( weights[element], 
          minor.value + searchWeight( scope.connections, 
            indexOf(weights,minor.value), element ));
      });
    indexes.splice( minor.index, 1);
  }

  scope.answer = weights;
}

function contains ( array, obj ) {
  var i = array.length;
  while (i--) {
    if (array[i] === obj) {
      return true;
    }
  }

  return false;
}

function searchWeight ( array, from, to ) {
  var weight;

  array.forEach( function ( element, index, array) {
    if( element.to === to && element.from === from ){
      weight = element.weight;
    }
  });

  return weight;
}

function indexOf ( array, value ) {
  var i = 0,
      len = array.length;

  for ( i = 0; i < len; i++ ) {
    if ( array[i] == value ) {
      return i;
    }
  }
}

function minInArray ( array ) {
  var i = 0,
      len = array.length,
      minor = {
        value: array[0],
        index: 0
      };

  for ( i = 1; i < len; i++) {
    if ( array[i] < minor.value ){
      minor.value = array[i];
      minor.index = i;
    }
  }

  return minor;
}

function temporalWeights ( indexes, array ) {
  var i = 0,
      len = indexes.length,
      weights = [];

  for ( i = 0; i < len; i++ ) {
    weights.push( array[indexes[i]] );
  };
  console.log(weights);
  return weights;
}