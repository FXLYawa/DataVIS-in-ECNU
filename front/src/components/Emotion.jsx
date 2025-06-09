// https://echarts.apache.org/examples/zh/editor.html?c=scatter-clustering

import React, { useLayoutEffect, useRef } from 'react';
import '../styles/Emotion.css';
import * as echarts from 'echarts';
import ecStat from 'echarts-stat';
import axios from 'axios';

const baseurl='http://127.0.0.1:8000/api';

async function getData(song) {
  //console.log(baseurl+song.emotion);
  try {
    const response = await axios.get(baseurl+song.emotion);
    //console.log(baseurl+song.emotion);
    console.log('请求成功:', response.data.vectors );
    console.log([
    [3.275154, 2.957587, 'awa', 1],
    [-3.344465, 2.603513, 'txt', 10],
    [0.355083, -3.376585, 'qaq', 50],
    [1.852435, 3.547351, '=-=', 100],
    [-2.078973, 2.552013, '=.=', 8],
  ])
    return response.data.vectors;

  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

/*return ([
    [3.275154, 2.957587, 'awa', 1],
    [-3.344465, 2.603513, 'txt', 10],
    [0.355083, -3.376585, 'qaq', 50],
    [1.852435, 3.547351, '=-=', 100],
    [-2.078973, 2.552013, '=.=', 8],
  ]);*/

async function  EmotionDraw(chartDom, song) {
  var myChart = echarts.init(chartDom);
  const data = await getData(song);
  echarts.registerTransform(ecStat.transform.clustering);

  var CLUSTER_COUNT = 6;
  // const originDims = ['x', 'y', 'name', 'value'];
  // const originDims = ['x', 'y', 'name']; // 如果不需要聚类维度，可以不传
  var DIENSIION_CLUSTER_INDEX = 4;
  var COLOR_ALL = [
    '#37A2DA',
    '#e06343',
    '#37a354',
    '#b55dba',
    '#b5bd48',
    '#8378EA',
    '#96BFFF'
  ];
  var pieces = [];
  for (var i = 0; i < CLUSTER_COUNT; i++) {
    pieces.push({
      value: i,
      label: 'cluster ' + i,
      color: COLOR_ALL[i]
    });
  }


  var option = {
    dataset: [
      {
        // dimensions: originDims,
        source: data,
      },
      {
        transform: {
          type: 'ecStat:clustering',
          // print: true,
          config: {
            clusterCount: CLUSTER_COUNT,
            outputType: 'single',
            outputClusterIndexDimension: DIENSIION_CLUSTER_INDEX,
            dimensions: [0, 1],
          }
        }
      }
    ],
  
    visualMap: {
      type: 'piecewise',
      top: 'end',
      min: 0,
      max: CLUSTER_COUNT - 1,
      left: 10,
      splitNumber: CLUSTER_COUNT,
      dimension: DIENSIION_CLUSTER_INDEX,
      pieces: pieces
    },
    grid: {
      left: 120
    },
    xAxis: [
      {
        name: 'y下刻度',
        type: 'value',
        nameLocation: 'middle',
        nameGap: 30,
      },
      {
        name: 'y上刻度',
        type: 'value',
        position: 'middle',
        nameLocation: 'center',
        nameGap: 30,
        axisLine: {
          show: false,
        },
        // show: false, // 第二个 x 轴不显示
      }
    ],
    yAxis: [
      {
        name: 'x左刻度',
        type: 'value',
        nameLocation: 'middle',
        nameGap: 30,
      },
      {
        name: 'x右刻度',
        type: 'value',
        position: 'middle',
        nameLocation: 'center',
        nameGap: 30,
        axisLine: {
          show: false,
        },
        // show: false, // 第二个 x 轴不显示
      }
    ],
    series: [{
      type: 'scatter',
      encode: {
        x: 0,          // 取 source 里对象的 x 属性做 x 轴
        y: 1,          // 取 source 里对象的 y 属性做 y 轴
        // 把 name 字段也映射到 tooltip，这样 params.data.name 能拿到
        tooltip: [0, 1, 2, 3],
      },
      symbolSize: function (value, params) {
        return value[3]; 
      },
      // symbolSize: 100,
      itemStyle: {
        borderColor: '#555'
      },
      datasetIndex: 1,
      emphasis: {
        focus: 'self',
        label: {
          show: true,
          position: 'top',
          formatter: function (params) {
            // params.data 就是 {x, y, name, /* 以及聚类维度 */}
            return params.data[2];
          },
          fontSize: 14,
          color: '#000'
        }
      }
    }]
  };
  
  option && myChart.setOption(option);
  window.addEventListener('resize', () => {
    myChart.resize();
  });
}

function Emotion({ song }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (chartRef.current) {
        EmotionDraw(chartRef.current, song);
    }
    return () => {
      if (chartRef.current) {
        echarts.dispose(chartRef.current);
      }
    };
  }, [song]);

  return <div ref={chartRef} className="emotion-container" />;
}

export default Emotion;
