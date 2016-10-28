(function () {
    // replace this line with your data
    var rawData;

    var charts = {
        'stock': {},
        'pie': {},
        'map': {},
        'column': {}
    };
    var tables = {};

    var tables_charts_arr = [];

    var $loader = $('#loader-wrapper');

    var $datetimepicker_start = $('#datetimepicker_start');
    var $datetimepicker_end = $('#datetimepicker_end');

    var $blog_found = $('#table-blog-found');
    var $site_found = $('#table-site-found');
    var $most_popular = $('#table-most-popular');
    var $most_search_keyword = $('#table-search-keywords');

    var $nav = $('#nav-date-time');
    var today = new Date($nav.find('[data-range="today"]').data('time'));
    var from_min_date;

    var from;
    var to;

    var $button_set_date = $('button#set-date');
    var $toggle_chart = $('.toggle-chart');

    var pattern_age_group = [
        {
            name: '< 18',
            from: 0,
            to: 17
        },
        {
            name: '18 - 24',
            from: 18,
            to: 24
        },
        {
            name: '25 - 34',
            from: 25,
            to: 34
        },
        {
            name: '35 - 44',
            from: 35,
            to: 44
        },
        {
            name: '> 45',
            from: 45
        }
    ];

    function web_audience_dashboard(rawData, filter) {
        var data = processData(rawData, filter);

        // create chart - Blog Visitors
        createStockChart_1('one', data['visitors']['blog_visitors'], 'blog-visitors', 'Blog Visitors', data['datetime']);
        // create chart - Visitors
        createStockChart_2('two', data['visitors'], 'visitors', 'Visitors', data['datetime']);
        // create chart - Audience Location
        createMap('one', data['location'], 'audience-location', 'Audience location');
        // create chart - Age Category
        createPieChart('one', data['age_info'], 'age-category', 'Visit by age category');
        // create chart - Device Category
        createPieChart('two', data['device_info'], 'device-category', 'Visit by device category');
        // create chart - Viewer's mobile devices
        createPieChart('three', data['device_info']['mobile'], 'mobile-devices', 'Viewer\'s mobile devices');

        // create table - How is your blog found
        createDataTable('one', data['visitors']['blog_visitors']['blog_url'], $blog_found);
        // create table - How links to you
        createDataTable('two', data['from_link'], $site_found);
        // create table - Most popular pages
        createDataTable('three', data['most_popular_page'], $most_popular);
        // create table - Most used search terms
        createDataTable('four', data['most_search_keyword'], $most_search_keyword);

        // create table/chart - How is your blog found
        createColumnChart('three', data['visitors']['blog_visitors']['blog_url'], 'blog-found');
        // create table/chart - How links to you
        createColumnChart('two', data['from_link'], 'links-to-you');
        // create table/chart - Most popular pages
        createColumnChart('one', data['most_popular_page'], 'most-popular');
        // create table/chart - Most used search terms
        createPieChart('four', data['most_search_keyword'], 'most-used-search-terms');

        function dateFormatTitleTooltip(hoveredDate, datetime) {
            var _date = new Date(hoveredDate);
            var timezone = _date.getTimezoneOffset();
            _date = new Date(_date.getTime() + timezone * 60 * 1000);

            var year = _date.getFullYear();
            var month = _date.getMonth() + 1;
            var date = _date.getDate();
            var hours = _date.getHours();
            var minutes = _date.getMinutes();

            if (month < 10) {
                month = '0' + month;
            }

            if (hours < 10) {
                hours = '0' + hours;
            }

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            var result = year + '/' + month + '/' + date;

            if (datetime) {
                result += ' ' + hours + ':' + minutes;
            }

            return result
        }

        function createStockChart_1(index, data, container, title, datetime) {

            if (charts['stock'][index]) {
                charts['stock'][index].dispose();
                charts['stock'][index] = null;
            }

            var chart;
            var data_chart = [];

            var count = data['values'].length ? data['values'].reduce(function (a, b) {
                return a + b;
            }) : 0;

            for (var i = 0; i < data['categories'].length; i++) {
                data_chart.push([data['categories'][i], data['values'][i]]);
            }

            data_chart.sort(function (a, b) {
                var time_a = new Date(a[0]).getTime();
                var time_b = new Date(b[0]).getTime();
                return time_a - time_b
            });

            // chart type
            chart = anychart.stock();
            chart.title(title);
            chart.tooltip().textFormatter(function () {
                return 'Users: ' + this.points[0].value;
            });
            chart.padding('0px');

            // set the data
            var table = anychart.data.table();
            table.addData(data_chart);

            // map the data
            var mapping_blog_users = table.mapAs();
            mapping_blog_users.addField('value', 1);

            // set the series
            var users = chart.plot(0);
            users.line(mapping_blog_users);
            users.legend().itemsTextFormatter(function () {
                return 'Visitors: ' + (this.value || 0) + ' of ' + count
            });

            chart.tooltip().titleFormatter(function () {
                return dateFormatTitleTooltip(this.hoveredDate, datetime);
            });

            // enabled false to scroller
            chart.scroller(false);

            // set container id for the chart
            chart.container(container);
            // initiate chart drawing
            chart.draw();

            charts['stock'][index] = chart;
        }

        function createMap(index, data, container, title) {

            if (charts['map'][index]) {
                charts['map'][index].dispose();
                charts['map'][index] = null;
            }

            var map;
            var data_map = [];
            var world_map = anychart.maps.world.features;
            var count = data['values'].length ? data['values'].reduce(function (a, b) {
                return a + b;
            }) : 0;

            for (var i = 0; i < data['names'].length; i++) {
                data_map.push(
                    {
                        'id': data['names'][i],
                        'value': data['values'][i]
                    }
                );
            }

            for (var j = 0; j < world_map.length; j++) {
                if (data['names'].indexOf(world_map[j].properties.id) === -1) {
                    data_map.push({
                        'id': world_map[j].properties.id,
                        'value': 0
                    });
                }
            }

            map = anychart.map();
            map.unboundRegions();
            map.geoData(anychart.maps.world);
            map.allowPointsSelect(false);
            map.padding('0px');

            var map_title = map.title();
            map_title.enabled(true);
            map_title.text(title + ' (' + count + ' visitors)');
            map_title.padding().bottom('25px');

            var series = map.choropleth(data_map);
            series.hoverFill('#f48fb1');
            series.stroke('#ddd');
            series.hoverStroke(anychart.color.darken('#f48fb1'));
            series.selectFill('#c2185b');
            series.selectStroke(anychart.color.darken('#c2185b'));
            series.labels().enabled(false);
            series.tooltip().textWrap('byLetter').useHtml(true);
            series.tooltip().textFormatter(function () {
                return '<span style="color: #d9d9d9">Visitors</span>: ' + this.value;
            });

            var scale = anychart.scales.ordinalColor([
                {less: 0},
                {from: 1, to: 10},
                {from: 10, to: 20},
                {from: 20, to: 40},
                {from: 40, to: 75},
                {greater: 75}
            ]);
            scale.colors(
                [
                    '#eee',
                    '#4fc3f7',
                    '#039be5',
                    '#0288d1',
                    '#0277bd',
                    '#01579b'
                ]
            );

            var colorRange = map.colorRange();
            colorRange.enabled(true).padding([0, 0, 20, 0]);
            colorRange.ticks().stroke('3 #ffffff').position('center').length(7).enabled(true);
            colorRange.colorLineSize(5);
            colorRange.marker().size(7);
            colorRange.labels().fontSize(11).padding(3, 0, 0, 0).textFormatter(function () {
                var range = this.colorRange;
                var name;
                if (isFinite(range.start + range.end)) {
                    name = range.start + ' - ' + range.end;
                } else if (isFinite(range.start)) {
                    name = '> ' + range.start;
                } else {
                    if (range.end === 0) {
                        name = range.end;
                    } else {
                        name = '< ' + range.end;
                    }
                }
                return name
            });

            series.colorScale(scale);
            map.container(container);
            map.draw();

            charts['map']['one'] = map;
        }

        function createPieChart(index, data, container, title) {

            if (charts['pie'][index]) {
                charts['pie'][index].dispose();
                charts['pie'][index] = null;
            }

            var chart;
            var data_chart = [];
            var count;

            if (data['values'].length) {
                count = data['values'].reduce(function (a, b) {
                    return a + b;
                });
            } else {
                count = 0;
            }

            for (var i = 0; i < data['categories'].length; i++) {
                data_chart.push(
                    {
                        'name': data['categories'][i],
                        'value': data['values'][i]
                    }
                );
            }

            // set data and chart type
            chart = anychart.pie(data_chart);
            // create empty area in pie chart
            chart.innerRadius('65%');
            chart.overlapMode(true);
            // set the insideLabelsOffset
            chart.insideLabelsOffset("-55%");
            chart.title(title);
            chart.padding('0px');
            if (!title) {
                chart.padding('25px');
            }
            chart.tooltip().textFormatter(function () {
                return 'Visitors: ' + this.value + '\n' + 'Percent Value: ' + (100 * this.value / count).toFixed(2) + '%';
            });

            // set chart labels settings
            var labels = chart.labels();
            labels.enabled(true);
            labels.fontColor("#60727B");
            labels.position("outside");
            labels.fontWeight('bold');
            labels.textFormatter(function () {
                return this.value
            });

            // set chart label settings
            var label_1 = chart.label(0);
            label_1.text('<span style="font-size: 32px; color: #A0B1BA;">' +
                count + '</span>');
            label_1.position("center");
            label_1.anchor("center");
            if (title) {
                label_1.offsetY("-10px");
            } else {
                label_1.offsetY("-25px");
            }
            label_1.useHtml(true);

            // set chart label settings
            var label_2 = chart.label(1);
            label_2.text('<span style="20px; color: #bbb;">' + 'Visitors' + '</span>');
            label_2.position("center");
            label_2.anchor("center");
            if (title) {
                label_2.offsetY("15px");
            } else {
                label_2.offsetY("0");
            }
            label_2.useHtml(true);

            // set container id for the chart
            chart.container(container);
            // init chart
            chart.draw();

            charts['pie'][index] = chart;
        }

        function createStockChart_2(index, data, container, title, datetime) {

            if (charts['stock'][index]) {
                charts['stock'][index].dispose();
                charts['stock'][index] = null;
            }

            var chart;
            var data_chart = [];

            var count_users = data['users'].length ? data['users'].reduce(function (a, b) {
                return a + b;
            }) : 0;

            var count_new_users = data['new_users'].length ? data['new_users'].reduce(function (a, b) {
                return a + b;
            }) : 0;

            // chart type
            chart = anychart.stock();
            chart.title(title);
            chart.padding('0px');

            for (var i = 0; i < data['date'].length; i++) {
                data_chart.push([data['date'][i], data['users'][i], data['new_users'][i]]);
            }

            data_chart.sort(function (a, b) {
                var time_a = new Date(a[0]).getTime();
                var time_b = new Date(b[0]).getTime();
                return time_a - time_b
            });

            chart.tooltip().titleFormatter(function () {
                return dateFormatTitleTooltip(this.hoveredDate, datetime);
            });

            chart.tooltip().textFormatter(function () {
                return 'Visitors: ' + this.points[0].value + '\n' + 'New Visitors: ' + this.points[1].value;
            });

            // set the data
            var table = anychart.data.table();
            table.addData(data_chart);

            // map the data
            var mapping_users = table.mapAs();
            mapping_users.addField('value', 1);
            var mapping_users_unique = table.mapAs();
            mapping_users_unique.addField('value', 2);

            // set the series
            var users = chart.plot(0);
            users.splineArea(mapping_users).fill('#1976d2 0.65').stroke('1.5 #1976d2');
            users.legend().itemsTextFormatter(function () {
                return 'Visitors: ' + (this.value || 0) + ' of ' + count_users
            });

            var users_unique = chart.plot(1);
            users_unique.splineArea(mapping_users_unique).fill('#ef6c00 0.65').stroke('1.5 #ef6c00');
            users_unique.legend().itemsTextFormatter(function () {
                return 'New Visitors: ' + (this.value || 0) + ' of ' + count_new_users
            });

            // enabled false to scroller
            chart.scroller(false);

            // set container id for the chart
            chart.container(container);
            // init chart
            chart.draw();

            charts['stock'][index] = chart;
        }

        function createDataTable(index, data, $el) {
            var $tbody = $el.find('tbody');

            if (tables[index] !== undefined) {
                tables[index].destroy();
            }

            tables[index] = $tbody.parent('table').DataTable({
                scrollY: '225px',
                scrollCollapse: true,
                paging: false,
                "dom": '<"top"f>rtip'
            });

            if ($tbody.children().length) {
                tables[index].clear();
                tables[index].draw();
            }

            // update table
            for (var i = 0; i < data.categories.length; i++) {
                if (data['unique_values'] !== undefined) {
                    tables[index].row.add([data['categories'][i], data['values'][i], data['unique_values'][i] + ' (' +
                        (data['unique_values'][i] * 100 / data['values'][i]).toFixed(2) + '%)'])
                        .draw();
                } else {
                    tables[index].row.add([data['categories'][i], data['values'][i]])
                        .draw();
                }
            }

        }

        function createColumnChart(index, data, container) {

            if (charts['column'][index]) {
                charts['column'][index].dispose();
                charts['column'][index] = null;
            }

            var chart;
            var data_chart = [];

            for (var i = 0; i < data['categories'].length; i++) {
                data_chart.push([data['categories'][i], data['values'][i], data['unique_values'][i]]);
            }

            // create data set on our data
            var dataSet = anychart.data.set(data_chart);

            // map data for the first series, take x from the zero column and value from the first column of data set
            var seriesData_1 = dataSet.mapAs({x: [0], value: [1]});

            // map data for the second series, take x from the zero column and value from the second column of data set
            var seriesData_2 = dataSet.mapAs({x: [0], value: [2]});

            // create column chart
            chart = anychart.column();
            // set padding
            chart.padding().top('15px');

            // temp variable to store series instance
            var series;

            // helper function to setup label settings for all series
            var setupSeries = function (series, name) {
                series.name(name);
                series.selectFill('#f48fb1 0.8').selectStroke('1.5 #c2185b');
            };

            // create first series with mapped data
            series = chart.column(seriesData_1);
            series.xPointPosition(0.45);
            setupSeries(series, 'Visitors');

            // create second series with mapped data
            series = chart.column(seriesData_2);
            series.xPointPosition(0.25);
            setupSeries(series, 'New Visitors');

            // set chart padding
            chart.barGroupsPadding(0.3);

            // format numbers in y axis label to match browser locale
            chart.yAxis().labels().textFormatter(function () {
                return this.value.toLocaleString();
            });

            chart.xAxis().labels().rotation('-90');

            // turn on legend
            chart.legend().enabled(true);

            chart.interactivity().hoverMode('single');

            // gets scroller
            var scroller = chart.xScroller();
            scroller.enabled(true);
            scroller.position('beforeAxes');

            // turn it on
            var xZoom = chart.xZoom();
            xZoom.setTo(0, 0.3);

            // set container id for the chart
            chart.container(container);

            // initiate chart drawing
            chart.draw();

            charts['column'][index] = chart;
        }
    }

    function processData(rawData, filter) {
        var data;
        var datetime = false;

        // return data by filter if filter exist
        if (filter) {
            data = rawData.filter(function (item) {
                var time = (new Date(item['date'])).getTime();
                var start_date = (new Date(filter['start-date'])).getTime();
                var end_date = (new Date(filter['end-date'])).getTime();

                return time >= start_date && time <= end_date
            });
        } else {
            data = rawData;
        }

        var index;
        var i;

        var visitors = [];
        var unique_visitors = [];
        var date_categories = [];

        var blog_visitors = [];
        var blog_visitors_categories = [];
        var blog_visitors_values = [];

        var location_categories = [];
        var location_values = [];

        var blog_from_url_categories = [];
        var blog_from_url_values = [];
        var blog_from_url_unique_visitor = [];

        var from_link_categories = [];
        var from_link_values = [];
        var from_link_values_unique = [];

        var most_popular_page_categories = [];
        var most_popular_page_values = [];
        var most_popular_page_values_unique = [];

        var most_search_keyword_categories = [];
        var most_search_keyword_values = [];

        var age_categories = [];
        var age_values = [];
        var age_categories_values = [];

        var device_categories = [];
        var device_values = [];
        var device_type = [];
        var device_user_agent_categories = [];
        var device_user_agent_type = [];
        var device_user_agent_values = [];
        var mobile_device_categories = [];
        var mobile_device_values = [];

        var _date;

        for (i = 0; i < data.length; i++) {
            if (data[i]['date']) {
                if (filter['end-date'].getTime() - filter['start-date'].getTime() <= 86400000) {
                    _date = data[i]['date'];
                    datetime = true;
                } else {
                    _date = new Date(data[i]['date']).getFullYear() + '-' + (new Date(data[i]['date']).getMonth() + 1) + '-' + new Date(data[i]['date']).getDate();
                }
                if (date_categories.indexOf(_date) === -1) {
                    date_categories.push(_date);
                }
            }
            if (data[i]['url']) {
                if (data[i]['url'].indexOf('blog') !== -1) {
                    blog_visitors.push(data[i]);
                }
                if (data[i]['url'].indexOf('search') !== -1) {
                    if (most_search_keyword_categories.indexOf(data[i]['keywords']) === -1) {
                        most_search_keyword_categories.push(data[i]['keywords']);
                    }
                }
                if (most_popular_page_categories.indexOf(data[i]['url']) === -1) {
                    most_popular_page_categories.push(data[i]['url']);
                }
            }
            if (data[i]['location']) {
                if (location_categories.indexOf(data[i]['location']) === -1) {
                    location_categories.push(data[i]['location']);
                }
            }
            if (data[i]['from']) {
                if (from_link_categories.indexOf(data[i]['from']) === -1) {
                    from_link_categories.push(data[i]['from']);
                }
            }
            if (data[i]['device']) {
                if (device_categories.indexOf(data[i]['device']) === -1) {
                    device_categories.push(data[i]['device']);
                }
            }
        }

        for (i = 0; i < date_categories.length; i++) {
            unique_visitors.push(0);
            visitors.push(0);
        }

        for (i = 0; i < pattern_age_group.length; i++) {
            pattern_age_group[i].to = pattern_age_group[i].to !== undefined ? pattern_age_group[i].to : 'x';
            age_categories_values.push([pattern_age_group[i].from, pattern_age_group[i].to]);
            age_categories.push(pattern_age_group[i].name);
            age_values.push(0);
        }

        for (i = 0; i < location_categories.length; i++) {
            location_values.push(0);
        }

        for (i = 0; i < from_link_categories.length; i++) {
            from_link_values.push(0);
            from_link_values_unique.push(0)
        }

        for (i = 0; i < most_popular_page_categories.length; i++) {
            most_popular_page_values.push(0);
            most_popular_page_values_unique.push(0);
        }

        for (i = 0; i < most_search_keyword_categories.length; i++) {
            most_search_keyword_values.push(0);
        }

        for (i = 0; i < blog_visitors.length; i++) {
            if (filter['end-date'].getTime() - filter['start-date'].getTime() <= 86400000) {
                _date = blog_visitors[i]['date'];
            } else {
                _date = new Date(blog_visitors[i]['date']).getFullYear() + '-' + (new Date(blog_visitors[i]['date']).getMonth() + 1) + '-' + new Date(blog_visitors[i]['date']).getDate();
            }
            if (blog_visitors_categories.indexOf(_date) === -1) {
                blog_visitors_values.push(0);
                blog_visitors_categories.push(_date);
            }
            if (blog_from_url_categories.indexOf(blog_visitors[i]['from']) === -1) {
                blog_from_url_values.push(0);
                blog_from_url_unique_visitor.push(0);
                blog_from_url_categories.push(blog_visitors[i]['from']);
            }
        }

        for (i = 0; i < data.length; i++) {
            if (data[i]['age']) {
                for (j = 0; j < age_categories.length; j++) {
                    var tmp = age_categories_values[j][1] === 'x' ? (+data[i]['age'] + 1) : age_categories_values[j][1];
                    if (age_categories_values[j][0] <= data[i]['age'] && tmp >= data[i]['age']) {
                        age_values[j] += 1;
                        break;
                    }
                }
            }
        }

        for (i = 0; i < device_categories.length; i++) {
            device_values.push(0);
        }

        for (i = 0; i < data.length; i++) {
            if (filter['end-date'].getTime() - filter['start-date'].getTime() <= 86400000) {
                _date = data[i]['date'];
            } else {
                _date = new Date(data[i]['date']).getFullYear() + '-' + (new Date(data[i]['date']).getMonth() + 1) + '-' + new Date(data[i]['date']).getDate();
            }
            index = date_categories.indexOf(_date);
            if (index !== -1) {
                visitors[index]++;
                if (data[i]['unique'] === 'true') {
                    unique_visitors[index]++;
                }
            }
            index = location_categories.indexOf(data[i]['location']);
            if (index !== -1) {
                location_values[index]++;
            }
            index = from_link_categories.indexOf(data[i]['from']);
            if (index !== -1) {
                from_link_values[index]++;
                if (data[i]['unique'] === 'true') {
                    from_link_values_unique[index]++;
                }
            }
            index = blog_visitors_categories.indexOf(_date);
            if (index !== -1 && data[i]['url'].indexOf('blog') !== -1) {
                blog_visitors_values[index]++;
            }
            if (data[i]['url'].indexOf('blog') !== -1) {
                index = blog_from_url_categories.indexOf(data[i]['from']);
                if (index !== -1) {
                    blog_from_url_values[index]++;
                    if (data[i]['unique'] === 'true') {
                        blog_from_url_unique_visitor[index]++;
                    }
                }
            }
            index = most_popular_page_categories.indexOf(data[i]['url']);
            if (index !== -1) {
                most_popular_page_values[index]++;
                if (data[i]['unique'] === 'true') {
                    most_popular_page_values_unique[index]++;
                }
            }
            index = most_search_keyword_categories.indexOf(data[i]['keywords']);
            if (index !== -1) {
                most_search_keyword_values[index]++;
            }
            index = device_categories.indexOf(data[i]['device']);
            if (index !== -1) {
                device_values[index]++;
            }
        }

        for (i = 0; i < device_categories.length; i++) {
            device_user_agent_categories.push(detectUserAgent(device_categories[i]));
        }

        for (i = 0; i < device_user_agent_categories.length; i++) {
            device_user_agent_type.push(detectDevice(device_user_agent_categories[i]));
        }

        for (i = 0; i < device_user_agent_type.length; i++) {
            if (device_type.indexOf(device_user_agent_type[i]) === -1) {
                device_type.push(device_user_agent_type[i]);
                device_user_agent_values.push(0);
            }
        }

        for (i = 0; i < device_user_agent_type.length; i++) {
            index = device_type.indexOf(device_user_agent_type[i]);
            device_user_agent_values[index] += device_values[i];
            if (device_user_agent_type[i] === 'mobile') {
                mobile_device_categories.push(device_categories[i]);
                mobile_device_values.push(0);
            }
        }

        for (i = 0; i < data.length; i++) {
            index = mobile_device_categories.indexOf(data[i]['device']);
            if (index !== -1) {
                mobile_device_values[index]++;
            }
        }

        return {
            'location': {
                'names': location_categories,
                'values': location_values
            },
            'visitors': {
                'users': visitors,
                'new_users': unique_visitors,
                'date': date_categories,
                'blog_visitors': {
                    'categories': blog_visitors_categories,
                    'values': blog_visitors_values,
                    'visitors': blog_visitors,
                    'blog_url': {
                        'categories': blog_from_url_categories,
                        'values': blog_from_url_values,
                        'unique_values': blog_from_url_unique_visitor
                    }
                }
            },
            'from_link': {
                'categories': from_link_categories,
                'values': from_link_values,
                'unique_values': from_link_values_unique
            },
            'most_popular_page': {
                'categories': most_popular_page_categories,
                'values': most_popular_page_values,
                'unique_values': most_popular_page_values_unique
            },
            'most_search_keyword': {
                'categories': most_search_keyword_categories,
                'values': most_search_keyword_values
            },
            'age_info': {
                'categories': age_categories,
                'values': age_values
            },
            'device_info': {
                'categories': device_type,
                'values': device_user_agent_values,
                'mobile': {
                    'categories': mobile_device_categories,
                    'values': mobile_device_values
                }
            },
            'datetime': datetime
        };
    }

    function heightInit() {
        var mq = window.matchMedia("(min-width: 768px)");
        var $chart_container = $('.chart_container');
        var $chart = $('.chart').not('.no-height-init');
        // sum of padding/margin and container-timeline height
        var offsetHeight = 145 + $('#container-timeline').height();

        // if parent != iframe
        if (self === top) {
            if (mq.matches) {
                var height = $(window).height() - offsetHeight;
                $chart.css('height', height / 2);
                $chart_container.matchHeight();
            } else {
                $chart.css('height', 350);
            }
        }
    }

    function hidePreloader() {
        $loader.fadeOut('slow');
    }

    function init(filter) {
        // draw dashboard
        web_audience_dashboard(rawData, filter);
        heightInit();
        // hide loader
        $loader.fadeOut();
    }

    function initDateTime() {
        $datetimepicker_start.datetimepicker();
        $datetimepicker_end.datetimepicker({
            useCurrent: false //Important! See issue #1075
        });

        $datetimepicker_start.on("dp.change", function (e) {
            $datetimepicker_end.data("DateTimePicker").minDate(e.date);
            $(this).datetimepicker('hide');
            $nav.find('li').removeClass('active');
        });

        $datetimepicker_end.on("dp.change", function (e) {
            $datetimepicker_start.data("DateTimePicker").maxDate(e.date);
            $(this).datetimepicker('hide');
            $nav.find('li').removeClass('active');
        });
    }

    // time line events
    $nav.on('click', 'a', function () {
        var range = $(this).data('range');

        if ($(this).closest('li').hasClass('active')) {
            return false
        }

        switch (range) {
            case 'today':
            {
                from = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 1), 0, 0);
                to = today;
                break;
            }
            case 'yesterday':
            {
                from = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 2), 0, 0);
                to = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 1), today.getHours(), today.getMinutes());
                break;
            }
            case 'week':
            {
                from = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - 6));
                to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            }
            case 'month':
            {
                from = new Date(today.getFullYear(), today.getMonth() - 1, (today.getDate()));
                to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            }
            case 'quarter':
            {
                from = new Date(today.getFullYear(), today.getMonth() - 4, (today.getDate()));
                to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            }
            case 'year':
            {
                from = new Date(today.getFullYear(), 0, 0);
                to = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            }
            case 'full':
            {
                from = from_min_date;
                to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0);
            }
        }

        // set datetime for input date
        $datetimepicker_start.data('DateTimePicker').date(from);
        $datetimepicker_end.data('DateTimePicker').date(to);

        // visible table, (table/chart)
        setTableVisible();

        $loader.fadeIn('slow', function () {
            // init
            init({
                'start-date': $datetimepicker_start.data('DateTimePicker').date().toDate(),
                'end-date': $datetimepicker_end.data('DateTimePicker').date().toDate()
            });
        });

        $(this).parents($nav).find('li').removeClass('active');
        $(this).closest('li').addClass('active');

        // visible chart, (table/chart)
        tables_charts_arr.filter(function ($el) {
            $el.attr('data-visible', 'chart')
        });

        // init toggle, set visible chart/table
        initToggle();
    });

    function minDate() {
        // search min date
        rawData.sort(function (visitor_a, visitor_b) {
            var time_a = new Date(visitor_a['date']).getTime();
            var time_b = new Date(visitor_b['date']).getTime();
            return time_a - time_b
        });

        return new Date(rawData[0]['date']);
    }

    function firstInit() {
        // get rawData from http://cdn.anychart.com/solutions-data/web-audience-data.json
        $.ajax({
            url: 'http://cdn.anychart.com/solutions-data/web-audience_data.json',
            success: function (data) {
                rawData = data;

                from_min_date = minDate();
                from = from_min_date;
                to = today;

                // set datetime for input date
                $datetimepicker_start.data('DateTimePicker').date(from_min_date);
                $datetimepicker_end.data('DateTimePicker').date(today);

                // firstInit
                init({
                    'start-date': from_min_date,
                    'end-date': today
                });

                $('[data-range="full"]').closest('li').addClass('active');
            }
        });
    }

    function setTableVisible() {
        tables_charts_arr = [];

        $('[data-visible]').each(function () {
            if ($(this).attr('data-visible') !== 'table') {
                tables_charts_arr.push($(this));
                $(this).attr('data-visible', 'table').removeClass('active');
            }
        });

        // init toggle, set visible chart/table
        initToggle();
    }

    function initToggle() {
        $('.chart_container').each(function () {
            // var $parent = $(this).closest('.chart_container');
            var $parent = $(this);

            if ($(this).attr('data-visible') === 'table') {
                $parent.find('.chart').hide();
                $parent.find('.table-container').show();

                $parent.find('.icon-chart').show();
                $parent.find('.icon-table').hide();

            } else if ($(this).attr('data-visible') === 'chart') {
                $parent.find('.table-container').hide();
                $parent.find('.chart').show();

                $parent.find('.icon-chart').hide();
                $parent.find('.icon-table').show();

                $(this).addClass('active')
            }
        });
    }

    anychart.onDocumentReady(function () {
        initDateTime();

        firstInit();

        // event set date
        $button_set_date.on('click', function () {
            if ($datetimepicker_start.data('DateTimePicker').date().toDate() !== null && $datetimepicker_end.data('DateTimePicker').date().toDate() !== null) {
                $loader.fadeIn('slow', function () {

                    $loader.fadeIn('slow', function () {
                        // init
                        init({
                            'start-date': $datetimepicker_start.data('DateTimePicker').date().toDate(),
                            'end-date': $datetimepicker_end.data('DateTimePicker').date().toDate()
                        });
                    });

                });
            }
        });

        // init toggle, set visible chart/table
        initToggle();

        // event toggle chart/table
        $toggle_chart.on('click', function () {
            var $parent = $(this).closest('.chart_container');
            var mq = window.matchMedia('(min-width: 992px)');

            if ($parent.attr('data-visible') === 'table') {
                $parent.find('.table-container').fadeOut('fast', function () {
                    $parent.find('.chart').fadeIn('slow');

                    $parent.find('.icon-table').show();
                    $parent.find('.icon-chart').hide();

                    $parent.attr('data-visible', 'chart');
                    if (mq.matches) {
                        heightInit();
                    }
                });
            } else if ($parent.attr('data-visible') === 'chart') {
                $parent.find('.chart').fadeOut('fast', function () {
                    $parent.find('.table-container').fadeIn('slow');
                    $parent.attr('data-visible', 'table');

                    $parent.find('.icon-table').hide();
                    $parent.find('.icon-chart').show();

                    if (mq.matches) {
                        heightInit();
                    }
                });
            }
        });
    });

    $(window).on('load', function () {
        hidePreloader();
    });

    $(window).bind('resize', heightInit);
})();

