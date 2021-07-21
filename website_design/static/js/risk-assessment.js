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
                value: level*100,
            }]
        }]
    };

    // setInterval(function () {
    //     option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
    //     myChartLevel.setOption(option, true);
    // }, 2000);
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
        for(var att in data)
        {
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
    $.get('/data/test/company_info', function (data) {
        data = JSON.parse(data);
        level = data['risk_level'];
        pro_array = data['probability'];
        draw_level(level);
        draw_probability(pro_array);
    })

    // $.get('/news', function (data) {
    //     data = JSON.parse(data);

    //     var keys = ["title", "date", "time", "content"]
    //     // var tbody = $("#com_news_info tbody");

    //     function add_table(item, index) {
    //         var tr = document.createElement("tr");
    //         var th = document.createElement("th");
    //         th.innerHTML = index + 1;
    //         th.setAttribute("scope", "row");
    //         tr.appendChild(th);
    //         for (var i = 0; i < 3; i++) {
    //             td = document.createElement("td");
    //             td.innerHTML = item[keys[i]];
    //             tr.appendChild(td);
    //         }
    //         td = document.createElement("td");
    //         bt = document.createElement("button");
    //         bt.setAttribute("type", "button");
    //         bt.setAttribute("class", "btn btn-primary");
    //         bt.setAttribute("data-container", "body");
    //         bt.setAttribute("data-toggle", "popover");
    //         bt.setAttribute("data-trigger", "hover");
    //         bt.setAttribute("data-placement", "left");
    //         bt.setAttribute("data-content", item[keys[i]].slice(0, 200) + '...');
    //         bt.innerHTML = "detail";
    //         td.appendChild(bt)
    //         tr.appendChild(td);
    //         $("#com_news_info tbody").append(tr)
    //     }
    //     data.forEach(add_table);
    //     // popover
    //     $('[data-toggle="popover"]').popover();
    //     $("#com_news_info").DataTable();
    // })

    // $('#company-id-button').click(function () {
    //     var company_id = $("#company-id").val();
    //     $("#show-company-id").html("Company ID: "+company_id);
    // })

})


$("#company-id-button").click(function () {
    var id = $("#company-id").val();
    // id = $("#company-ids").children('option:selected').val();
    $.get("company-risk-type/"+id, function (data, status) {
        if(status==500)
        {
            alert("Please input corect company ID.");
        }
        var data = JSON.parse(data);
        draw_probability(data.pro);
        if(data.type==0)
        {
            $("#risk-type").html("Legal Risk");
            $("#risk-explanlation").html("The risk caused by the invalidity of the contract within the scope of law and the inability to perform it, or the improper conclusion of the contract.")
        }
        else if(data.type==1)
        {
            $("#risk-type").html("Other Risk");
            $("#risk-explanlation").html("Some risks except for legal risk, loan risk, operation risk")
        }
        else if(data.type==2)
        {
            $("#risk-type").html("Loan Risk");
            $("#risk-explanlation").html("The possibility of various losses faced by the lender in the process of operating the loan business, which is the measure to measure the degree of loan risk.")
        }
        else
        {
            $("#risk-type").html("Operation Risk");
            $("#risk-explanlation").html("The possibility that the future operating cash flow will change due to changes in production and operation or changes in market environment, thus affecting the market value.")
        }
    })

    $.get("data/feature/risk_level_show/"+id, function (data) {
        var level = JSON.parse(data);
        level = level.toFixed(2);
        draw_level(level);
    })

    $.get("data/company/risk_type_show/"+id, function (data) {
        var data = JSON.parse(data);

        // var basic_info = data.basic_info;
        // $("div.card-deck h1:eq(0)").html(basic_info.INDUSTRYPHY_x)
        // $("div.card-deck h1:eq(1)").html(basic_info.brand_num_x)
        // $("div.card-deck h1:eq(2)").html(basic_info.honor_num_x)
        // console.log(basic_info.ASSGRO);
        // $("div.card-deck h1:eq(3)").html(parseFloat(basic_info.ASSGRO).toFixed(2))
        // $("div.card-deck h1:eq(4)").html(parseFloat(basic_info.avg_EMPNUM).toFixed(0))
        var basic_info = data.BasicInfo;
        $("div.card-deck h1:eq(0)").html(basic_info.IndustryCategory)
        $("div.card-deck h1:eq(1)").html(basic_info.BrandNum)
        $("div.card-deck h1:eq(2)").html(basic_info.HonorNum)
        $("div.card-deck h1:eq(3)").html(parseFloat(basic_info.TotalAssets).toFixed(2))
        $("div.card-deck h1:eq(4)").html(parseFloat(basic_info.EmployeeNum).toFixed(0))


        // var op_risk = data.operation_risk;
        // var law_risk = data.law_risk;
        // var loan_risk = data.loan_risk;
        // var other_risk = data.other_risk;

        var counter = 0;
        for(var att in data)
        {
            if(att != "BasicInfo")
            {
                var table = document.createElement("table");
                table.setAttribute("class", "table");
                var thead = document.createElement("thead");
                thead.setAttribute("class", "thead");
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.setAttribute("scope", "col");
                th.innerHTML = "#";
                tr.appendChild(th);

                var th = document.createElement("th");
                th.setAttribute("scope", "col");
                th.innerHTML = "item";
                tr.appendChild(th);

                var th = document.createElement("th");
                th.setAttribute("scope", "col");
                th.innerHTML = "value";
                tr.appendChild(th);

                thead.appendChild(tr);
                table.appendChild(thead)

                var tbody = document.createElement("tbody");
                var j = 0;
                for (var att_inner in data[att])
                {
                    j++;
                    var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.setAttribute("scope", "row");
                    th.innerHTML = j;
                    tr.appendChild(th);

                    var td = document.createElement("td");
                    td.innerHTML = att_inner;
                    tr.appendChild(td);
                    var td = document.createElement("td");
                    if (att=="OtherRisk"){
                        td.innerHTML = parseFloat(data[att][att_inner]);
                    }
                    else
                    {
                        td.innerHTML = data[att][att_inner]
                    }
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                }
                table.appendChild(tbody);

                $("div.d-block")[counter].append(table);
                counter++;
            }
        }

        // for (var att in op_risk)
        // {
        //     var li_key = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = att;
        //     li_key.appendChild(h3);

        //     var li_val = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = op_risk[att];
        //     li_val.appendChild(h3);
        //     $("#carouselExampleDivTest ul:eq(0)").append(li_key);
        //     $("#carouselExampleDivTest ul:eq(1)").append(li_val);
        // }
        // for (var att in law_risk)
        // {
        //     var li_key = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = att
        //     li_key.appendChild(li_key);

        //     var li_val = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = law_risk[att]
        //     li_val.appendChild(h3)
        //     $("#carouselExampleDivTest ul:eq(2)").append(li_key);
        //     $("#carouselExampleDivTest ul:eq(3)").append(li_val);
        // }
        // for (var att in loan_risk)
        // {
        //     var li_key = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = att
        //     li_key.appendChild(li_key);

        //     var li_val = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = loan_risk[att]
        //     li_val.appendChild(h3)
        //     $("#carouselExampleDivTest ul:eq(4)").append(li_key);
        //     $("#carouselExampleDivTest ul:eq(5)").append(li_val);
        // }
        // for (var att in other_risk)
        // {
        //     var li_key = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = att
        //     li_key.appendChild(li_key);

        //     var li_val = document.createElement("li");
        //     var h3 = document.createElement("h3");
        //     h3.innerHTML = other_risk[att]
        //     li_val.appendChild(h3)
        //     $("#carouselExampleDivTest ul:eq(6)").append(li_key);
        //     $("#carouselExampleDivTest ul:eq(7)").append(li_val);
        // }
    })
})
