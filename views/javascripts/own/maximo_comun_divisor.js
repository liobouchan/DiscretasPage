var gcfAppModule  = angular.module('gcfApp', []);

gcfAppModule.controller('GcfController', gcfController);

gcfController.$inject = ['$scope'];
function gcfController( scope ){

  scope.gcf = function () {
    var result = gcfEuclidsAlgorithm ( scope.gcf1, scope.gcf2 );
    scope.gcf.x = result.x;
    scope.gcf.y = result.y;
    scope.gcf.gcf = result.gfc;
    scope.gcf.lcf = ( scope.gcf1 * scope.gcf2 ) / result.gfc ;
  };

  scope.linealCon = function () {
    var result = linealCoungruence ( scope.lc1, scope.lc2, scope.lc3 );
    console.log(result);
    scope.linealCon.fsol = result.first_solution;
    scope.linealCon.gs = result.general_solution;
  };

  scope.chinese = function () {
    var arrayx = [scope.cta1,scope.cta2,scope.cta3,scope.cta4];
    var arrayy = [scope.ctb1,scope.ctb2,scope.ctb3,scope.ctb4];
    
    scope.chinese.sol = chineseTheorem(arrayx, arrayy);
  }
}

function linealCoungruence ( number1, number2, number3 ) {
  var result = {};

  var gcf = gcfEuclidsAlgorithm( number1, number3 );

  result = {
    "first_solution": (number2 * gcf.x),
    "general_solution": (number2 * gcf.x) + ' + ' + number3 + ' * k'
  }

  return result;
}

function gcfEuclidsAlgorithm ( number1, number2 ) {
  var a = new Array(),
      b = new Array(),
      d = new Array(),
      k = new Array();

  var i = 2;

  a[0] = 1; b[0] = 0; d[0] = number1; k[0] = 0;
  a[1] = 0; b[1] = 1; d[1] = number2; k[1] = division( true, d[0], d[1]);

  while ( true ){
    a[i] = a[(i-2)] - ( a[(i-1)] * k[(i-1)]);
    b[i] = b[i-2] - ( b[i-1] * k[i-1]);
    d[i] = division( false, d[i-2], d[i-1] );
    k[i] = division( true, d[i-1], d[i]);
    if(d[i] <= 0){
      break;
    }
    i++;
  }

  var result = {
    "x": a[i-1],
    "y": b[i-1],
    "gfc": d[i-1]
  }

  return result;
}

/*
  The flag is to know if you want the quotient or the residue, 
  return quotient if flag is true
  return residue if flag is false
*/
function division ( flag, dividend, divider ) {
  var quotient = 0,
      residue = 1;

  if ( divider > 0 ) {
    while ( true ) {
      residue = dividend - ( divider * quotient );

      if( residue >= 0 ){
        quotient++;
      } else {
        residue = dividend - ( divider * (quotient -1) );
        quotient--;
        break;
      }
    }
  }

  return flag ? quotient: residue;
}

function lastEquivalent( a, m ){
  if( m < 0 ){
    return lastEquivalent( a, -1 * m );
  }else if( a >= 0 && a < m){
    return a;
  }else if( a < 0 ){
    return -1*lastEquivalent( -1 * a, m ) + m ;
  }else{
    return a - m; 
  }
}

function chineseTheorem( residues, mods ){
  var m = 1,
      i = 0,
      residueEq =0,
      result;

  var xValues = [];

  for(i = 0 ; i < mods.length ; i++ ){
    m = m * mods[i];
  }

  for(i = 0 ; i < 4 ; i++ ){
    xValues.push( gcfEuclidsAlgorithm( m / mods[i] , mods[i] ).x );
  }

  for(i = 0 ; i < mods.length ; i++ ){
    var helper  = m/mods[i];
    residueEq = residueEq + helper * residues[i] * xValues[i];
  }

  residueEq = lastEquivalent(residueEq,m);

  result = "x ≡ " + residueEq + " (mod " + m + ")";
  return result;
}