var echartPieCollapse;

$(document).ready(function() {
    echartPieCollapse = echarts.init(document.getElementById('echart_mini_pie'), echart_theme);
});
function createPieChart() {
    echartPieCollapse.showLoading('default', {
        text: 'Lade Daten...',
        effect: 'bubble',
        textStyle: {
            fontSize: 20
        }
    });
    $.getJSON('/api/elec_gen.php', {
        "year[]": (dashboardState.year || 2015),
        "group_by[]": ["fuel"],
        "order_by[SUM_amount]": "DESC",
        "aggr[amount]": "SUM",
        "range[limit]": 5,
        "columns[]": ["fuel"]
    }).done(function (data) {
        var values = [];
        var columns = [];
        $.each(data, function (i, item) {
            columns[i] = item.fuel;
            values[i] = {name: item.fuel, value: item.SUM_amount};
        });

        dashboardState.fuel = columns;

        echartPieCollapse.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'right',
                y: 'bottom',
                data: columns
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            series: [{
                name: 'Area Mode',
                type: 'pie',
                radius: [30, 110],
                center: ['50%', 170],
                roseType: 'area',
                x: 'center',
                max: 40,
                sort: 'ascending',
                data: values
            }]
        });
        render_line_graph();
        echartPieCollapse.hideLoading();
    });
}
$(document).ready(createPieChart);