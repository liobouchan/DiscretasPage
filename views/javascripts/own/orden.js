var ordenAppModule  = angular.module('ordenApp', []);

ordenAppModule.controller('OrdenController', ordenController);

ordenController.$inject = ['$scope'];
function ordenController( scope ){

  var i = 0, j = 0;
  scope.words = [];
  scope.matrix = [];

  for (i = 0; i < 8; i++) {
    scope.matrix.push([]);
    for (j = 0; j < 8; j++) {
      scope.matrix[i].push(0);
    }
  }

  scope.temporal = {
    word: ''
  };
  
  scope.addWord = function () {
    scope.words.push( scope.temporal.word );
    scope.temporal.word = '';
  };

  scope.order = function () {
    scope.words = lexicographicOrder( scope.words );
  }

  scope.graph = function () {
    var graph = createGraphFromMatrix( scope.matrix );
    init(graph.nodes, graph.links);
  };
}

function createGraphFromMatrix ( matrix ) {
  var graph = {
    nodes: [],
    links: []
  };

  var i   = 0,
      j   = 0,
      len = 0;

  matrix.forEach( function (element, index, array ) {
    graph.nodes.push({  key: index + 1, 
                        text: index +1, 
                        color: "white" });
  });

  len = matrix.length;
  for (i = 0; i < len; i++){
    for (j = 0; j < len; j++){
      if ( matrix[i][j] === 1 ){
        graph.links.push({  to: i + 1, 
                            from:   j + 1});
      }
    }
  }

  return graph;
}

function lexicographicOrder ( array ) {
  var order     = [],
      temporal  = '',
      i         = 0,
      where     = 0,
      len       = 0,
      flag      = false;

  order.push( array[0] );
  array.forEach( function ( element, index, array ) {
    if ( index !== 0 ){
      temporal = element;

      order.forEach ( function ( element, index, array ) {
        if ( !flag ){
          len = temporal.length < element.length ? temporal.length:element.length;
          for ( i = 0; i < len; i++) {
            if ( element.charAt(i) !== temporal.charAt(i) ){
              flag = temporal.charAt(i) < element.charAt(i) ? true:false;
              break;
            }
          }
          where = index;
        }
      });
      if ( flag ){
        order.splice( where, 0, temporal );
        flag = false;
      } else{
        order.push( temporal );
      }
    }
  });

  return order;
};

function init( nodeDataArray, linkDataArray ) {
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "myDiagram",  // create a Diagram for the DIV HTML element
        {
          // position the graph in the middle of the diagram
          initialContentAlignment: go.Spot.Center,

        });

    // Define the appearance and behavior for Nodes:

    // First, define the shared context menu for all Nodes, Links, and Groups.

    // a context menu is an Adornment with a bunch of buttons in them
    var partContextMenu =
      $(go.Adornment, "Vertical");

    function nodeInfo(d) {  // Tooltip info for a node data object
      var str = "Node " + d.key + ": " + d.text + "\n";
      if (d.group)
        str += "member of " + d.group;
      else
        str += "top-level node";
      return str;
    }

    // These nodes have text surrounded by a rounded rectangle
    // whose fill color is bound to the node data.
    // The user can drag a node by dragging its TextBlock label.
    // Dragging from the Shape will start drawing a new link.
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle",
          { fill: "white",
            portId: "", cursor: "pointer",  // the Shape is the port, not the whole Node
            // allow all kinds of links from and to this port
            fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
            toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 4,  // make some extra space for the shape around the text
            isMultiline: false,  // don't allow newlines in text
            editable: true },  // allow in-place editing by user
          new go.Binding("text", "text").makeTwoWay()),  // the label shows the node data's text
        { // this tooltip Adornment is shared by all nodes
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#FFFFCC" }),
              $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling nodeInfo(data)
                new go.Binding("text", "", nodeInfo))
            ),
          // this context menu Adornment is shared by all nodes
          contextMenu: partContextMenu
        }
      );

    // The link shape and arrowhead have their stroke brush data bound to the "color" property
    myDiagram.linkTemplate =
      $(go.Link,
        { relinkableFrom: true, relinkableTo: true },  // allow the user to relink existing links
        $(go.Shape,
          { strokeWidth: 2 },
          new go.Binding("stroke", "color")),
        $(go.Shape,
          { toArrow: "Standard", stroke: null },
          new go.Binding("fill", "color")),
        { // this tooltip Adornment is shared by all links
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "#FFFFCC" }),
              $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling linkInfo(data)
                new go.Binding("text", "", linkInfo))
            ),
          // the same context menu Adornment is shared by all links
          contextMenu: partContextMenu
        }
      );

    // Define the behavior for the Diagram background:

    function diagramInfo(model) {  // Tooltip info for the diagram's model
      return "Model:\n" + model.nodeDataArray.length + " nodes, " + model.linkDataArray.length + " links";
    }

    // Create the Diagram's Model:
    

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // now enable undo/redo, only after setting the Diagram.model
    myDiagram.model.undoManager.isEnabled = true;
    function linkInfo(d) {  // Tooltip info for a link data object
      return "Link:\nfrom " + d.from + " to " + d.to;
    }
}