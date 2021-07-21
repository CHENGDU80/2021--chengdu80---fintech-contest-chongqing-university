function draw_indicator(data_list) {
    var chartDomAccount = document.getElementById('indicator');
    var myChartAccount = echarts.init(chartDomAccount);


    var option = {
        title: {
            // text: '基础雷达图'
        },
        legend: {
            data: ['Company A', 'Company B']
        },
        radar: {
            // shape: 'circle',
            indicator: [
                { text: 'tax indicator', max: 5},
                { text: 'stability indicator', max: 5},
                { text: 'power indicator', max: 5},
                { text: 'operating indicator', max: 5},
                { text: 'law indicator', max: 5}
            ],
            name: {
                fontSize: 20
            }
        },
        series: [{
            name: 'Comapany A vs Company B',
            type: 'radar',
            data: [
                {
                    value: data_list
                    // name: 'Company A'
                }
            ]
        }]
    };

    myChartAccount.setOption(option)
    window.onresize = function () {
        myChartAccount.resize();
    };
}

var range_data = {
    "CompanyID": [
        0.0,
        1234551265.0
    ],
    "CompanyType": [
        0.0,
        59.0
    ],
    "HonorNum": [
        0.0,
        10.0
    ],
    "IndustryCategory": [
        0.0,
        17.0
    ],
    "Province": [
        0.0,
        9.0
    ],
    "PartnerNum": [
        0.0,
        0.0
    ],
    "CompanyStatus": [
        0.0,
        0.0
    ],
    "CertificateNum": [
        0.0,
        0.0
    ],
    "RecordChangeNum": [
        0.0,
        0.0
    ],
    "BrandNum": [
        0.0,
        0.0
    ],
    "EmployeeNum": [
        -4.5,
        12.82
    ],
    "TotalAssets": [
        -908.56,
        1546.83
    ],
    "InvestedCapital": [
        -1387.0,
        2445.0
    ],
    "Liabilities": [
        -207.06,
        345.87
    ],
    "profitable": [
        -1.28,
        1.92
    ],
    "AssetLoss": [
        -1.82,
        1.9
    ],
    "PensionInsurance": [
        -4.2,
        5.88
    ],
    "UnemploymentInsurance": [
        -3.55,
        5.12
    ],
    "MedicalInsurance": [
        -4.49,
        6.23
    ],
    "InjuryInsurance": [
        -3.71,
        5.21
    ],
    "MaternityInsurance": [
        -4.15,
        5.93
    ]
}

function totxt(seltxt) {
    document.getElementById('company-id').value = seltxt;
}


$(function () {
    $.get('/data/feature/level', function (data) {
        data = JSON.parse(data);
        for (var att in data) {
            // a = document.createElement('a');
            // a.setAttribute("class", "dropdown-item");
            // a.innerHTML = att;
            // // console.log(a);
            // $("#company-ids").append(a);
            var option = document.createElement("option");
            option.innerHTML = att;
            option.setAttribute("value", att);
            $("#company-ids").append(option);
        }
    })

    var test_list = [2, 1, 4, 5, 2];
    draw_indicator(test_list);
    $.post('/data/company/basic_com_info_perfect', function (data) {
        data = $.parseJSON(data);

        var keys = new Array();

        thead = document.createElement("thead");
        tr = document.createElement("tr");
        th = document.createElement("th");
        th.setAttribute("scope", "col")
        th.innerHTML = "#";
        tr.appendChild(th);
        for (var att in data[0]) {
            keys.push(att);
            th = document.createElement("th");
            th.setAttribute("scope", "col");
            th.innerHTML = att;
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        $("#com_news_info").append(thead);

        range_keys = new Array();
        for (var att in range_data) {
            range_keys.push(att);
        }
        tbody = document.createElement("tbody");
        function add_table(item, index) {
            var tr = document.createElement("tr");
            var th = document.createElement("th");
            th.innerHTML = index + 1;
            th.setAttribute("scope", "row");
            tr.appendChild(th);

            for (var i = 0; i < keys.length; i++) {
                td = document.createElement("td");
                var value = item[keys[i]];
                if (range_keys.indexOf(keys[i]) != -1) {
                    var up_down = range_data[keys[i]];
                    var down = up_down[0];
                    var up = up_down[1];
                    if (!(down == 0.0 && up == 0.0)) {
                        if (value < down || value > up) {
                            td.setAttribute("class", "text-danger font-weight-bold");
                            // console.log("yes");
                        }
                    }
                }
                td.innerHTML = value;
                tr.appendChild(td);
            }
            // td = document.createElement("td");
            // bt = document.createElement("button");
            // bt.setAttribute("type", "button");
            // bt.setAttribute("class", "btn btn-primary");
            // bt.setAttribute("data-container", "body");
            // bt.setAttribute("data-toggle", "popover");
            // bt.setAttribute("data-trigger", "hover");
            // bt.setAttribute("data-placement", "left");
            // bt.setAttribute("data-content", item[keys[i]].slice(0, 200) + '...');
            // bt.innerHTML = "detail";
            // td.appendChild(bt)
            // tr.appendChild(td);
            tbody.appendChild(tr)
        }
        data.forEach(add_table);
        $("#com_news_info").append(tbody);
        // popover
        // $('[data-toggle="popover"]').popover();
        // $("#com_news_info").DataTable();
        var table = $('#com_news_info').DataTable({
            // lengthChange: false,
            buttons: ['copy', 'excel', 'pdf', 'print', 'colvis']
        });
        table.buttons().container().appendTo($('#table-button'));
    })

    // 画降维的散点图
    $.get('data/feature/scatter', function (data) {
        var data = JSON.parse(data)

        var chartDomTsne = document.getElementById('tsne');
        var myChartTsne = echarts.init(chartDomTsne);
        var option;

        option = {
            xAxis: {},
            yAxis: {},
            series: [{
                symbolSize: 5,
                data: data[0],
                type: 'scatter',
                color: '#EC3E13'
            },
            {
                symbolSize: 5,
                data: data[1],
                type: 'scatter',
                color: '#DFEC13'
            },
            {
                symbolSize: 5,
                data: data[2],
                type: 'scatter',
                color: '#1389EC'
            },
            {
                symbolSize: 5,
                data: data[3],
                type: 'scatter',
                color: '#53EDEF'
            }]
        };

        myChartTsne.setOption(option);
        window.onresize = function () {
            myChartTsne.resize();
        };
    })

})


$('#company-id-button').click(function () {
    var company_id = $("#company-id").val();
    // id = $("#company-ids").children('option:selected').val();

    // $("#show-company-id").html("Company ID: " + company_id);

    $.get('data/company/indicator/' + company_id, function (data) {
        data = JSON.parse(data);
        data_list = [];
        for (arr in data) {
            data_list.push(data[arr]);
        }
        draw_indicator(data_list);
    })
})
