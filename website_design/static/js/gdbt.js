function draw_probability(pro_array) {
    var chartDomPro = document.getElementById('probability');
    var myChartPro = echarts.init(chartDomPro);
    var option = {
        // color: ['#8A96DE', '#5AD050', '#F4FB03', '#DC153C'],
        color: ['#A5F99B', '#9BB3F9', '#F68C8C', '#F6CA8A'],
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: pro_array[0], name: 'Legal Risk' },
                    { value: pro_array[1], name: 'Others' },
                    { value: pro_array[2], name: 'Loan Risk' },
                    { value: pro_array[3], name: 'Operation Risk' },
                ]
            }
        ]
    };

    myChartPro.setOption(option);
    window.onresize = function () {
        myChartPro.resize();
    };
}

function draw_level(level) {
    var chartDomLevel = document.getElementById('level');
    var myChartLevel = echarts.init(chartDomLevel);
    var option;

    option = {
        title: {
            name: "Risk Level"
        },
        series: [{
            type: 'gauge',
            axisLine: {
                lineStyle: {
                    width: 30,
                    color: [
                        [0.2, '#A5F99B'],
                        [0.4, '#9BB3F9'],
                        [0.6, '#F6EF8C'],
                        [0.8, '#F7C893'],
                        [1.0, '#F68C8C']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: 'auto'
                }
            },
            axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                    color: '#fff',
                    width: 2
                }
            },
            splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                    color: '#fff',
                    width: 4
                }
            },
            axisLabel: {
                color: 'auto',
                distance: -60,
                fontSize: 20
            },
            detail: {
                valueAnimation: true,
                formatter: '{value}%',
                color: 'auto'
            },
            data: [{
                value: level * 100,
            }]
        }]
    };
    myChartLevel.setOption(option);
    window.onresize = function () {
        myChartLevel.resize();
    };
}

function totxt(seltxt) {
    document.getElementById('company-id').value = seltxt;
}


$(function () {
    $.get('/data/feature/level', function (data) {
        data = JSON.parse(data);
        for (var att in data) {
            var option = document.createElement("option");
            option.innerHTML = att;
            option.setAttribute("value", att);
            $("#company-ids").append(option);

        }
    })
    $.get('/data/test/company_info', function (data) {
        data = JSON.parse(data);
        level = data['risk_level'];
        pro_array = data['probability'];
        draw_level(level);
        draw_probability(pro_array);
    })

})

$("#company-id-button").click(function () {
    var id = $("#company-id").val();

    $.get("model-risk-type/gdbt/" + id, function (data, status) {
        if (status == 500) {
            alert("Please input corect company ID.");
        }
        var data = JSON.parse(data);
        draw_probability(data.pro);
    })

    $.get("data/feature/risk_level_show/" + id, function (data) {
        var level = JSON.parse(data);
        level = level.toFixed(2);
        draw_level(level);
    })
})
