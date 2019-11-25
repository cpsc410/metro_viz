console.log("metro renderer running...");
const container = d3.select("#mapHolder");

const width = 1600;
const height = 1000;

d3.json('./api/mapG')
  .then(data => {
    console.log(data);
    const svg = container.append('svg');

    // LINES
    var lineFunction = d3.line()
      .x(function(d) { return d[0]; })
      .y(function(d) { return d[1]; })
      .curve(d3.curveLinear);

    svg.selectAll("path")
      .data(data.edges)
      .enter()
      .append("path")
      .attr("d", function (d){
        var line = transformXYLine(d.pos);
        var endHead = getPosOf(d.head, data.objects);
        var endTail = getPosOf(d.tail, data.objects);

        if(dist(endHead, line[0]) > dist(endTail, line[0])){
          let temp = endHead;
          endHead = endTail;
          endTail = temp;
        }
        line.unshift(endHead);
        line.push(endTail);
        console.log(line);
        return lineFunction(line);
      })
      .attr("stroke", function(d) {
        return d.color;
      })
      .attr("stroke-width", 10)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("fill", "none");

    // NODES

    let group = svg.selectAll("g")
      .data(data.objects).enter()
      .append("g");

    group
      .append("circle")
      .attr("r", function (d) {
        return d.contributors.length === 1 ?  10 : 16;
      })
      .style("fill", function(d) {
        if(d.contributors.length !== 1){
          return "white";
        }
        for(var i = 0; i < data.edges.length; i++){
          if(data.edges[i].head === d._gvid || data.edges[i].tail === d._gvid){
            return data.edges[i].color;
          }
        }
      })
      .attr("stroke", function(d) {
        return d.contributors.length === 1 ?  "none" : "grey";
      })
      .attr("stroke-width", function(d) {
        return 5;
      })
      .attr("cx", function (d) {return transformXYPoint(d.pos)[0]; })
      .attr("cy", function (d) { return transformXYPoint(d.pos)[1]; });
    group
      .append("text")
      .text(function (d) { return d.name.substr(d.name.lastIndexOf("/") + 1); })
      .style('font-family', "London Tube")
      .attr("x", function (d) {return transformXYPoint(d.pos)[0]; })
      .attr("text-anchor", "middle")
      .attr("y", function (d) { return transformXYPoint(d.pos)[1] - 20; });

    //svg.selectAll("path")


    svg.attr("width", "100%").attr("height", "100%");
    function zoomed() {
      svg.selectAll('g').attr('transform', d3.event.transform.toString());
      svg.selectAll('path').attr('transform', d3.event.transform.toString());
    }
    const zoomy = d3
      .zoom()
      .scaleExtent([0.5, 6])
      .on('zoom', zoomed);

    const zoomContainer = svg.call(zoomy);

    let hidden = false;
    document.onkeypress = function(e) {
      console.log(e);
      if(e.key === 'l'){
        if(hidden) d3.selectAll("text").style('display', 'block');
        else d3.selectAll("text").style('display', 'none');
        hidden = !hidden;
      }
    };
  });

function getPosOf(id, nodes) {
  for (var i = 0; i < nodes.length; i++){
    if(nodes[i]._gvid === id){
      return transformXYPoint(nodes[i].pos);
    }
  }
}

function transformXYPoint(point) {
  let xy = point.split(",");
  return [xy[1]*2.5, xy[0]*2.5];
}

function transformXYLine(point) {
  let xy = point.replace("e,", "").split(" ");
  xy.splice(0, 1);
  let res = [];
  for (var i = 0; i < xy.length; i++){
    res.push(transformXYPoint(xy[i]));
  }
  return res;
}

function dist(one, two) {
  var a = one[0] - two[0];
  var b = one[1] - two[1];

  return  Math.sqrt( a*a + b*b );
}
