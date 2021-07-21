var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';


var chartDomRelation = document.getElementById('relation');
var myChart = echarts.init(chartDomRelation);
myChart.showLoading();

$.get(ROOT_PATH + '/data/asset/data/webkit-dep.json', function (webkitDep) {

    myChart.hideLoading();

    var option = {
        legend: {
            data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
        },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                position: 'right',
                formatter: '{b}'
            },
            draggable: true,
            data: webkitDep.nodes.map(function (node, idx) {
                node.id = idx;
                return node;
            }),
            categories: webkitDep.categories,
            force: {
                edgeLength: 5,
                repulsion: 20,
                gravity: 0.2
            },
            edges: webkitDep.links
        }]
    };

    myChart.setOption(option);
});


var chartDomAccount = document.getElementById('account');
var myChartAccount = echarts.init(chartDomAccount);

// Schema:
// date,AQIindex,PM2.5,PM10,CO,NO2,SO2
// 回调函数是可以访问全局变量的
var dataGZ = 1;
var dataBJ = 2;
var dataSH = 3;
// 回调函数可以访问全局变量，但是ajax请求是异步的，所以会造成先使用后更改值的情况
function get_data(){
    $.get("data/test/dataGZ", function (data, status) {
        data = $.parseJSON(data);
        dataGZ = data;
    })
    $.get("data/test/dataBJ", function (data, status) {
        data = $.parseJSON(data);
        dataBJ = data;
    })

    $.get("data/test/dataSH", function (data, status) {
        data = $.parseJSON(data);
        dataSH = data;
    })
};

$.ajaxSettings.async = false;
get_data();
$.ajaxSettings.async = true;

console.log(dataSH);
console.log(dataBJ);
console.log(dataSH);
var lineStyle = {
    normal: {
        width: 1,
        opacity: 0.5
    }
};

var option = {
    backgroundColor: '#161627',
    title: {
        text: 'AQI - 雷达图',
        left: 'center',
        textStyle: {
            color: '#eee'
        }
    },
    legend: {
        bottom: 5,
        data: ['北京', '上海', '广州'],
        itemGap: 20,
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        selectedMode: 'single'
    },
    // visualMap: {
    //     show: true,
    //     min: 0,
    //     max: 20,
    //     dimension: 6,
    //     inRange: {
    //         colorLightness: [0.5, 0.8]
    //     }
    // },
    radar: {
        indicator: [
            { name: 'AQI', max: 300 },
            { name: 'PM2.5', max: 250 },
            { name: 'PM10', max: 300 },
            { name: 'CO', max: 5 },
            { name: 'NO2', max: 200 },
            { name: 'SO2', max: 100 }
        ],
        shape: 'circle',
        splitNumber: 5,
        name: {
            textStyle: {
                color: 'rgb(238, 197, 102)'
            }
        },
        splitLine: {
            lineStyle: {
                color: [
                    'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                    'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                    'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                ].reverse()
            }
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(238, 197, 102, 0.5)'
            }
        }
    },
    series: [
        {
            name: '北京',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            symbol: 'none',
            itemStyle: {
                color: '#F9713C'
            },
            areaStyle: {
                opacity: 0.1
            }
        },
        {
            name: '上海',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataSH,
            symbol: 'none',
            itemStyle: {
                color: '#B3E4A1'
            },
            areaStyle: {
                opacity: 0.05
            }
        },
        {
            name: '广州',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataGZ,
            symbol: 'none',
            itemStyle: {
                color: 'rgb(238, 197, 102)'
            },
            areaStyle: {
                opacity: 0.05
            }
        }
    ]
};

myChartAccount.setOption(option)

// pie chart
var chartDomPie = document.getElementById('pie');
var myChartPie = echarts.init(chartDomPie);

var option = {
    backgroundColor: '#2c343c',

    title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    },

    tooltip: {
        trigger: 'item'
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 274, name: '联盟广告' },
                { value: 235, name: '视频广告' },
                { value: 400, name: '搜索引擎' }
            ].sort(function (a, b) { return a.value - b.value; }),
            roseType: 'radius',
            label: {
                color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
            },
            itemStyle: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
};
myChartPie.setOption(option);
