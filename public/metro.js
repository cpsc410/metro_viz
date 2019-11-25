console.log("metro renderer running...");
const container = d3.select("#mapHolder");

const width = 1600;
const height = 1000;

d3.xml('./api/map')
  .then(data => {
    container.node().append(data.documentElement);
    const svg = container.select('svg');

    svg.attr("width", "100%").attr("height", "100%");
    function zoomed() {
      svg.select('g').attr('transform', d3.event.transform.toString());
    }
    const zoomy = d3
      .zoom()
      .scaleExtent([0.5, 6])
      .on('zoom', zoomed);

    const zoomContainer = svg.call(zoomy);


    const parentNode = d3.select("circle").node().parentNode;

    d3.selectAll("circle").each(function () {
      d3.select(this.parentNode).insert("text", "[data-id=\"" + this.getAttribute('data-id') + "\"]").node().data = this;
    });

    d3.selectAll("text").text(function() {
      return this.data.getAttribute('data-label').substr(this.data.getAttribute('data-label').lastIndexOf("/") + 1);
    }).attr("x", function() {
      return (this.data.getAttribute('cx') || 0) - 0.04;
    }).attr("y", function() {
      return (this.data.getAttribute('cy') || 0) - 0.12;
    }).attr('font-size', '0.1');

    container.selectAll('circle').on('click', function(data) {
      console.log(this.getAttribute('data-label'));
    });
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
