function draw_relation() {
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
}

$(function () {

})
