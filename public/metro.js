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
  });
