// https://echarts.apache.org/examples/en/editor.html?c=graph-circular-layout


import React, { useLayoutEffect, useRef } from 'react';
import * as echarts from 'echarts';
import '../../../styles/Word.css';
import axios from 'axios'; 

const baseurl='http://127.0.0.1:8000/api/bar/arc';

async function getData(song) {
  try {
    const response = await axios.get(baseurl+song.head);
    console.log('请求成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

async function LinkDraw(chartDom, song) {
  var myChart = echarts.init(chartDom);
  
  const graph =await getData(song);

  var option = {
    title: {
      text: '弧长链接图',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        data: graph.categories.map(function (a) {
          return a.name;
        })
      }
    ],
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: '弧长链接图',
        type: 'graph',
        layout: 'circular',
        circular: {
          rotateLabel: true
        },
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        }
      }
    ]
  };
  
  option && myChart.setOption(option);
  window.addEventListener('resize', () => {
    myChart.resize();
  });
}

function WordLink({ song }) {
  const chartRef = useRef(null);
  
  useLayoutEffect(() => {
    if (chartRef.current) {
        LinkDraw(chartRef.current, song);
    }
    return () => {
      if (chartRef.current) {
        echarts.dispose(chartRef.current);
      }
    };
  }, [song]);
  return <div ref={chartRef} className='word-sub-link' />;
}

export default WordLink;