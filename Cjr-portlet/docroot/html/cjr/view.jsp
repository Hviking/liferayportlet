<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>

<portlet:defineObjects />
<%
	String ctx = renderResponse.encodeURL(renderRequest
			.getContextPath());
%>
<%
String basePath=renderRequest.getContextPath();
%>

        
      
        <script>
            $(document).ready(function() {
                /**
                 * Grid theme for Highcharts JS
                 * @author Torstein Honsi
                 */

                Highcharts.theme = {
                    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
                    chart: {
                        backgroundColor: {
                            linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
                            stops: [
                                [0, 'rgb(255, 255, 255)'],
                                [1, 'rgb(240, 240, 255)']
                            ]
                        },
                        borderWidth: 0.5,
                        plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                        plotShadow: true,
                        plotBorderWidth: 1,
                        reflow: true
                    },
                    title: {
                        style: {
                            color: '#000',
                            font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    subtitle: {
                        style: {
                            color: '#666666',
                            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    xAxis: {
                        gridLineWidth: 1,
                        lineColor: '#000',
                        tickColor: '#000',
                        labels: {
                            style: {
                                color: '#000',
                                font: '11px Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        title: {
                            style: {
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'

                            }
                        }
                    },
                    yAxis: {
                        minorTickInterval: 'auto',
                        lineColor: '#000',
                        lineWidth: 1,
                        tickWidth: 1,
                        tickColor: '#000',
                        labels: {
                            style: {
                                color: '#000',
                                font: '11px Trebuchet MS, Verdana, sans-serif'
                            }
                        },
                        title: {
                            style: {
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
                            }
                        }
                    },
                    legend: {
                        itemStyle: {
                            font: '9pt Trebuchet MS, Verdana, sans-serif',
                            color: 'black'

                        },
                        itemHoverStyle: {
                            color: '#039'
                        },
                        itemHiddenStyle: {
                            color: 'gray'
                        }
                    },
                    labels: {
                        style: {
                            color: '#99b'
                        }
                    },
                    navigation: {
                        buttonOptions: {
                            theme: {
                                stroke: '#fffff'
                            }
                        }
                    }
                };

// Apply the theme
                var highchartsOptionscjr = Highcharts.setOptions(Highcharts.theme);
                countcjrService();
            });


        </script>
        <script>
        function countcjrService() {
        	 var totalcjr = 0;
             var cjrtdata = [];
        	 var cjrJson=$("#cjrdata").text();
        	 cjrJson = eval("(" + cjrJson + ")");
        	  $.each(cjrJson, function(i, n) {
                  var name = n.name;
                  totalcjr += n.count;

              });

              $.each(cjrJson, function(i, n) {
                  var name = n.name;
                  var per = (n.count / totalcjr) * 100;
                  cjrtdata.push([name, per]);

              });
            //  $("#title").text("开发区统计企业总数：" + total);
              chydrawPie("cjrtg", "开发区统计", cjrtdata);
             
        }
          
        function  chydrawPie(id, title, cjrtdata) {
                      $('#' + id).highcharts({
                          chart: {
                              plotBackgroundColor: null,
                              plotBorderWidth: null,
                              plotShadow: false,
                              zoomType: 'xy',
                              backgroundColor: 'rgba(0,0,0,0)'
                          },
                          title: {
                              text: ''
                          },
                          tooltip: {pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

                          },
                          exporting: {
                              enabled: false //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
                          },
                          credits: {
                              enabled: false
                          },
                          plotOptions: {
                              pie: {
                                  allowPointSelect: true,
                                  cursor: 'pointer',
                                  dataLabels: {
                                      enabled: false,
                                      color: '#000000',
                                      connectorColor: '#000000',
                                      format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                  },
                                  showInLegend: true
                              }
                          },
                          series: [{
                                  type: 'pie',
                                  name: title,
                                  data: cjrtdata

                              }]
                      });
                  }

              </script>

        <div style="display: none">
        	<p id='cjrdata'>${cjrstr }</p>
        </div>
         <div id='warpcjr'>
            <div  id='cjrtg' >

            </div>
        </div>