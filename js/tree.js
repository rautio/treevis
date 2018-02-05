(function(){
'use strict'; //strict mode
/*
 * @file JavaScript code for Random Binary Tree application.
 * @author Oskari Rautiainen
 * Based on Peter Cook's D3 Tree (http://animateddata.co.uk/lab/d3-tree/)
 */
  require(['d3','jquery','rainbowvis'], function(d3, $, Rainbow){
    let rainbow = new Rainbow(),
      width = 840,
      height = 600,
      maxDepth = 10, //max depth of the tree
      currentColor = '#8e3496', //starting color
      useRainbow = false,
      numBranches = 2,
      seed = {i: 0, x: 420, y: 600, a: 0, l: 130, d:0, c:currentColor}, // a = angle, l = length, d = depth
      branches = [], //branch data
      da = 0.5, // Angle delta
      dl = 0.8, // Length delta (factor)
      ar = 0.7; // Randomness

    //Create a tree branch
    function branch(b){
      var end = endPt(b), daR, newB;
      //Initialize the seed
      b.c = currentColor;
      branches.push(b);

      if (b.d === maxDepth){
        return;
      }

      // Left branch
      daR = ar * Math.random() - ar * 0.5;
      newB = {
        i: branches.length,
        x: end.x,
        y: end.y,
        a: b.a - da + daR,
        l: b.l * dl,
        d: b.d + 1,
        parent: b.i,
        c: currentColor
      };
      branch(newB);

      // Right branch
      daR = ar * Math.random() - ar * 0.5;
      newB = {
        i: branches.length,
        x: end.x,
        y: end.y,
        a: b.a + da + daR,
        l: b.l * dl,
        d: b.d + 1,
        parent: b.i,
        c: currentColor
      };
      branch(newB);
    }

    //Either create a tree or update it
    function regenerate(initialise) {
      //Reset color if using random coloring
      if(useRainbow){
        currentColor = randomColor();
      }
      $('#color_picker').val(currentColor);
      //Rebuild tree
      branches = [];
      branch(seed);
      if(initialise){
        create();
      }else{
        update();
      }
    }

    function randomColor(){
      return '#'+rainbow.colorAt(Math.round(Math.random()*100) + 1);
    }

    function endPt(b) {
      // Return endpoint of branch
      var x = b.x + b.l * Math.sin( b.a );
      var y = b.y - b.l * Math.cos( b.a );
      return {x: x, y: y};
    }


    // D3 stuff

    function x1(d) {return d.x;}
    function y1(d) {return d.y;}
    function x2(d) {return endPt(d).x;}
    function y2(d) {return endPt(d).y;}
    function color(d) {return d.c;}
    function highlightParents(color){
      return function (d) {
        var color = d3.event.type === 'mouseover' ? 'green' : color;
        var depth = d.d;
        for(var i = 0; i <= depth; i++) {
          d3.select('#id-'+parseInt(d.i)).style('stroke', color);
          d = branches[d.parent];
        }
      }
    }

    function create(){
      d3.select('svg')
        .attr('width',width)
        .attr('height',height)
        .selectAll('line')
        .data(branches)
        .enter()
        .append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', color)
        .style('stroke-width', function(d) {return parseInt(maxDepth + 1 - d.d) + 'px';})
        .attr('id', function(d) {return 'id-'+d.i;})
        .on('mouseover', highlightParents(color))
        .on('mouseout', highlightParents(color));
    }


    function update() {
      //Bind data
      var sel =
        d3.select('svg')
        .selectAll('line')
        .data(branches);
      //Add new elements
      sel.enter().append('line')
        .attr('stroke', color)
        .on('mouseover', highlightParents(color))
        .on('mouseout', highlightParents(color));

      //Bind data
      sel =
        d3.select('svg')
        .selectAll('line')
        .data(branches);
      //Remove old elements
      sel.exit().remove();
      //Update existing elements
      sel.transition()
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', color)
        .style('stroke-width', function(d) {return parseInt(maxDepth + 1 - d.d) + 'px';})
        .attr('id', function(d) {return 'id-'+d.i;});
    }

    //Listen for regenerate button press
    $('#regenerate').on('click',function(){
      regenerate(false);
    });

    //Listen for color picker update
    $('#color_picker').on('change', function(){
      currentColor = $('#color_picker').val();
    });

    //Rainbow checkbox
    $('#rainbow_checkbox').on('change', function(){
      if($('#rainbow_checkbox').is(':checked')){
        $('#color_picker').prop('disabled',true);
        currentColor = randomColor();
        useRainbow = true;
      }
      else{
        $('#color_picker').prop('disabled',false);
        useRainbow = false;
      }
    });

    //Listen for maxDepth update
    $('#depth-level').on('change',function(){
      maxDepth = parseInt($('#depth-level').val());
    });

    //Initialize the maxDepth UI
    $('#depth-level').val(maxDepth);
    //Initialize the color_picker UI
    $('#color_picker').val(currentColor);
    regenerate(true);
  });

})();