import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface DataPoint {
  latitude: number;
  longitude: number;
  value: number;
}

interface D3MapProps {
  data: DataPoint[];
}

const D3Map: React.FC<D3MapProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.attr('viewBox', `0 0 ${width} ${height}`).style('background-color', 'white');

    const projection = d3.geoMercator().scale(120).translate([width / 2, height / 1.5]);
    const path = d3.geoPath().projection(projection);

    // Load and display the World map
    d3.json('https://d3js.org/world-50m.v1.json').then((world: any) => {
      svg.append('g')
        .selectAll('path')
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append('path')
        .attr('fill', 'none')
        .attr('stroke', '#999')
        .attr('d', path);

      // Add bubbles
      svg.append('g')
        .selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr('r', d => Math.sqrt(d.value) * 5) // Adjust size as needed
        .attr('fill', 'blue')
        .attr('opacity', 0.6)
        .on('mouseover', function (event, d) {
          const [x, y] = projection([d.longitude, d.latitude]);
          svg.append('text')
            .attr('id', 'tooltip')
            .attr('x', x)
            .attr('y', y - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-family', 'sans-serif')
            .attr('fill', 'black')
            .text(d.value);
        })
        .on('mouseout', function () {
          svg.select('#tooltip').remove();
        });
    });
  }, [data]);

  return <svg ref={svgRef} style={{ width: '100%', height: '100vh' }} />;
};

export default D3Map;
