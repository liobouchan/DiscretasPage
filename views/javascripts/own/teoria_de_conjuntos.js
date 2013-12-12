function start(){
  $( ".draggable" ).draggable({ revert: true,
                                revertDuration: 200});

  $( ".droppable" ).droppable({ accept: ".draggable",
                                hoverClass: "droppable-hover",
                                drop: elementDropped });
}

function elementDropped(event, ui){
  var element = $(ui.draggable).data('element'),
      elementContainer = $( "<div class = 'temporal-element text-center' " +
                            "data-element = '" + element + "'> "+
                              "<span class= 'element'>" + element + "</span>"+
                              "<span class='cross'> X </span>" +
                            "</div>"),
      flag = false,
      newElement,
      temporalElements = $(this).children('.temporal-element'),
      temporalElementsLength,
      i;
  temporalElementsLength = temporalElements.length;
  for (i = 1 ; i <= temporalElementsLength; i++) {
    newElement = $(this).children('.temporal-element:nth-child(' + i +')').data('element');
    if(newElement === element){
      flag = true;
    }
  };

  if(!flag){
    $(this).append(elementContainer);
    $('.cross').hide();

    $(".temporal-element").on('mouseenter', showCloseOption);
    $(".temporal-element").on('mouseleave', hideCloseOption);
    $(".cross").on("click", removeElement);
  }

  operations();
}

function showCloseOption(){
  $(this).find(".element").hide();
  $(this).find(".cross").show();
}

function hideCloseOption(){
  $(this).find(".cross").hide();
  $(this).find(".element").show();
}

function removeElement(){
  $(this).parent().remove();
  operations();
}

/*
  Operaciones Teoria de Conjuntos
*/

function union( subsetA, subsetB ){
  var subsetALength = subsetA.length,
      subsetBLength = subsetB.length,
      union = new Array(),
      repeatedElements = new Array(),
      repeatedElementsLength;

  for (i = 0; i < subsetALength; i++) {
    for (j = 0; j < subsetBLength; j++) {
      if( subsetA[i] === subsetB[j]){
        repeatedElements = repeatedElements.concat(subsetA[i]);
      }
    }
  }

  union = insertionSort( subsetA.concat( subsetB ) );

  repeatedElementsLength = repeatedElements.length;
  for (i = 0; i < repeatedElementsLength; i++) {
    union.splice( union.indexOf(repeatedElements[i]), 1);
  }

  return union;
}

function intersection( subsetA, subsetB ){
  var subsetALength = subsetA.length,
      subsetBLength = subsetB.length,
      intersection = new Array();

  for (i = 0; i < subsetALength; i++) {
    for (j = 0; j < subsetBLength; j++) {
      if( subsetA[i] === subsetB[j]){
        intersection = intersection.concat(subsetA[i]);
      }
    }
  }

  return intersection;
}

function complement( universe, subset ){

  var complement = new Array(),
      i,
      subsetLength = subset.length;

  complement = insertionSort( universe.concat( subset ) );

  for (i = 0; i < subsetLength; i++) {
    complement.splice( complement.indexOf(subset[i]), 2);
  }

  return complement;
}

function operations(){
  var a = new Array(),
      b = new Array(),
      c = new Array(),
      i,
      subsetLength,
      subsetA =  $('#subsetA').children('.temporal-element'),
      subsetB =  $('#subsetB').children('.temporal-element'),
      subsetC =  $('#subsetC').children('.temporal-element'),
      universe = new Array();

  for (i = 1; i <= 20; i++) {
    universe[i - 1] = i;
  }

  a = insertionSort( jqueryToJsArray( subsetA, '#subsetA' ) );
  b = insertionSort( jqueryToJsArray( subsetB, '#subsetB' ) );
  c = insertionSort( jqueryToJsArray( subsetC, '#subsetC' ) );

  /*
    Las operaciones solicitadas
    1) A^c U B^c
    2) A^c N B
    3) (A N B N C)^c
  */

  var operation1 = union( complement( universe, a ), complement( universe, b )),
      operation2 = intersection( complement( universe, a ), b ),
      operation3 = complement ( universe , intersection( a, intersection( b, c )));

  $('.subsetA').text(a.join(', '));
  $('.subsetB').text(b.join(', '));
  $('.subsetC').text(c.join(', '));
  $('.operation1').text(operation1.join(', '));
  $('.operation2').text(operation2.join(', '));
  $('.operation3').text(operation3.join(', '));
}

/*
  Método de ordenación
*/

function insertionSort( array ) {
  var size = array.length,
      slot,
      temporal;
 
  for ( var item = 0; item < size; item++ ) { // outer loop     
    temporal = array[item];
    for ( slot = item - 1; slot >= 0 && array[slot] > temporal; slot-- ){ // inner loop
      array[ slot + 1 ] = array[slot];
    }
    array[ slot + 1 ] = temporal;
  }
  return array;
};

/*
  Convertir array de jquery a js
*/

function jqueryToJsArray( array , jqueryElement){
  var arrayLength = array.length,
      jsArray = new Array;

  for (i = 0; i < arrayLength; i++) {
    jsArray[i] = $(jqueryElement).children('.temporal-element:nth-child(' + (i+1) +')').data('element');
  }

  return jsArray;
}

$(document).on('ready', start);