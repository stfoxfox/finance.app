var sel_x_my = 0;
var fixed_sel_x_my = 0;
var global_graph_display = [];
var popupHandler = null;
var _cur_page = 1;
var _global_group_id = 0;

$(function(){
    //$('#list-events').jScrollPane();

    //Time Filters
    $('.filters-btn').on('click', 'button', function() {
     var _this = $(this);
     var filter = _this.data('filter');
     var title = _this.find('span').text();
     $('.headerTimelineTrigger').text(title);

     if ( !_this.hasClass('active')) {
     $('.filters-btn').find('button').removeClass('active');
     _this.addClass('active');

     //window.location.href = getFilterLink();
     }
     });
     $("#showYear").trigger("click");
    $(".headerTimelineTrigger").html($("#showYear span").html());

    $(".filters-btn button").click(function(){
        fixed_sel_x_my = 0;
        var itemId = $(this).attr("id");
        updateGraph(itemId);
    });


    $('.dream-popup').magnificPopup({
        type:'inline',
        midClick: false
    });

    $("#graph-canvas").click(function(){
        if (sel_x_my >= 0) {
            fixed_sel_x_my = Number(sel_x_my);
            //$("#list-events div.list_item").eq(sel_x_my).trigger("click");
            var itemId = $(".filters-btn button.active").attr("id");
            updateGraph(itemId);
        }
        //$("#dream_id").val(sel_x_my);


    });

    $("#more_groups").click(function(){
        if ($(this).hasClass("active"))
        {
            $(".event_change_wrap .event_change").hide();
            $(".event_change_wrap .event_change:lt(3)").show();
            $(this).removeClass("active");
        }
        else
        {
            $(".event_change_wrap .event_change").removeClass("hidden").show();
            $(this).addClass("active");
            $(".event_change_wrap .event_change").last().addClass("last");
        }

        return false;
    });

    $("#more_events").click(function(){
        /*var cur_num = Number($("#events_count").html());
        var total = Number($("#events_maxcount").html());
        if (cur_num + 10 < total)
        {
            $("#events_count").html((cur_num + 10));
        }
        else
        {
            $("#events_count").html(total);
            $("#more_events").hide();
        }
        $('#list-events .list_item.hidden:lt(10)').removeClass("hidden");*/

        var _group_id = -1;
        if (_global_group_id > 0)
        {
            _group_id = _global_group_id;
        }

        $.ajax({
            url: "/DreamAjax/loadMore",
            type: "post",
            dataType: "json",
            data: {cur_page: _cur_page, group_id: _group_id,type: $(".timeline-btn-group .btn.active").attr("id")},
            success: function(data)
            {
                _cur_page += 1;
                $("#more_events").before(data['result']);
                if (_cur_page * 10 < data['totalCount'])
                {
                    $("#events_count").html(_cur_page * 10);
                }
                else
                {
                    $("#events_count").html(data['totalCount']);
                    $("#more_events").hide();
                }
                $("#events_maxcount").html(data['totalCount']);
                initScripts();
            }
        });

        return false;
    });

    $(".event_change .col1 img,.event_change .col1 .title").click(function(e){
        e.preventDefault();
        var url = $(this).parent().attr("data-url");
        if (url.length != "")
        {
            window.location.href = url;
        }

    });

    $("#dream-popup .save_button").click(function(){
        var elem = $("#mark_elem");

        var dream_id = $(elem).attr("dream-id");
        var group_id = $(elem).attr("dream-group-id");
        var project_id = $(elem).attr("dream-project-id");
        var subproject_id = $(elem).attr("dream-subproject-id");
        var task_id = $(elem).attr("dream-task-id");
        var project_event_id = $(elem).attr("dream-project-event-id");
        var stat = $(elem).parent().hasClass("active")? 1 : 0;
        var cmt = $("#my_comment").val();

        $.ajax({
            url: "/DreamAjax/setDream",
            type: "post",
            data: {dr_id: dream_id, gr_id: group_id, pr_id: project_id, sp_id: subproject_id, ta_id: task_id, pe_id: project_event_id, status: stat,comment: cmt},
            success: function(data) {

                $("#dream-popup .mfp-close").trigger("click");
            }

        });

        return false;
    });

    $(".list_item .dream").click(function(e){
        e.preventDefault();
        var elem = $(this).parent().parent();
        var curr = $(this);

        var dream_id = $(elem).attr("dream-id");
        var group_id = $(elem).attr("dream-group-id");
        var project_id = $(elem).attr("dream-project-id");
        var subproject_id = $(elem).attr("dream-subproject-id");
        var task_id = $(elem).attr("dream-task-id");
        var project_event_id = $(elem).attr("dream-project-event-id");
        var stat = $(elem).attr("dream-stat") == 0 ? 1 : 0;
        var cmt = $(elem).attr("dream-comment");

        $.ajax({
            url: "/DreamAjax/setDream",
            type: "post",
            data: {dr_id: dream_id, gr_id: group_id, pr_id: project_id, sp_id: subproject_id, ta_id: task_id, pe_id: project_event_id, status: stat,comment: cmt},
            success: function(data) {
                if ($(curr).hasClass("active"))
                {
                    $(curr).removeClass("active");
                    $(elem).attr("dream-stat","0");
                }
                else
                {
                    $(curr).addClass("active");
                    $(elem).attr("dream-stat","1");
                }
                if (data > 0)
                {
                    $(elem).attr("dream-id",data);
                }
            }

        });

        return false;
    });
    /*$("div.list_item").click(function(){
        var ref= $(this).attr("data-ref");
        window.location.href = ref;
    });*/

});

function setPopup(elem)
{
    var to_put = $(elem).find(".action").html();
    $(".dream_wrap .content").html(to_put);

    var elem2 = "#mark_elem";

    var dream_id = $(elem2).attr("dream-id",$(elem).attr("dream-id"));
    var group_id = $(elem2).attr("dream-group-id",$(elem).attr("dream-group-id"));
    var project_id = $(elem2).attr("dream-project-id",$(elem).attr("dream-project-id"));
    var subproject_id = $(elem2).attr("dream-subproject-id",$(elem).attr("dream-subproject-id"));
    var task_id = $(elem2).attr("dream-task-id",$(elem).attr("dream-task-id"));
    var project_event_id = $(elem2).attr("dream-project-event-id",$(elem).attr("dream-project-event-id"));
    $("#my_comment").val($(elem).attr("dream-comment"));
    if ($(elem).attr("dream-stat") == "1")
    {
        $(elem2).parent().addClass("active");
    }
    else
    {
        $(elem2).parent().removeClass("active");
    }
   // var stat = $(elem2).parent().hasClass("active")? 0 : 1;

    popupHandler = elem;

    $.magnificPopup.open({
        items: {
            src: '#dream-popup',
            type: 'inline'
        }
    });
}

function changeSelection(elem,group_id)
{
    var _group_id = -1;
    _cur_page = 0;
    if (group_id > 0)
    {
        _group_id = _global_group_id = group_id;
    }
    var type = $(".timeline-btn-group .btn.active").attr("id");

    $.ajax({
        url: "/DreamAjax/loadMore",
        type: "post",
        dataType: "json",
        data: {cur_page: _cur_page, group_id: _group_id,type: $(".timeline-btn-group .btn.active").attr("id")},
        success: function(data)
        {
            $("#list-events .wrap .list_item ").remove();

            $(".event_change_wrap .event_change").removeClass("active");
            $(elem).addClass("active");
            var
                d1 = [],
                graph, i;

            var counter = 0;
            if (data['result'].length > 0) {
                d1.push([0, counter]);

                _cur_page += 1;
                $("#more_events").before(data['result']);
                if (_cur_page * 10 < data['totalCount']) {
                    if (data['totalCount'] <= 10) {
                        $("#events_count").html(data['totalCount']);
                    }
                    else {
                        $("#events_count").html(_cur_page * 10);
                    }
                    $("#more_events").show();
                }
                else {
                    $("#events_count").html(data['totalCount']);
                    $("#more_events").hide();
                }
                $("#events_maxcount").html(data['totalCount']);


                var assoc_arr = [];
                for (var k in data['graph']){
                    if (data['graph'].hasOwnProperty(k)) {

                        var t_a = k.split("-");
                        if (typeof assoc_arr[Number(t_a[1])] == "undefined" || assoc_arr[Number(t_a[1])] == undefined) {
                            assoc_arr[Number(t_a[1])] = [];
                            assoc_arr[Number(t_a[1])]['count'] = Number(data['graph'][k]);
                            assoc_arr[Number(t_a[1])]['last_event'] = '';
                        }
                        else
                        {
                            assoc_arr[Number(t_a[1])]['count'] += Number(data['graph'][k]);
                        }
                    }
                }

                var iter=0;
                var counter = 0;
                for (var f in assoc_arr) {
                    counter = counter + assoc_arr[f]['count'];
                    d1.push([Number(f), counter]);
                }
                //assoc_arr.sort(function(a,b){return a['count']<b['count'];});
                global_graph_display = assoc_arr;




                //$('#list-events').jScrollPane();

                graph = Flotr.draw(
                    document.getElementById("graph-canvas"),
                    [
                        {
                            data: d1,
                            lines : {show: true, fill : false, fillColor: "#d3f0ff" },
                            backgroundColor : '#36b7ff',
                            fillOpacity: 0.1,
                            points : { show : true }
                        }
                    ],
                    {
                        mouse : {
                            track           : true, // Enable mouse tracking
                            lineColor       : '#ffa836',
                            relative        : true,
                            position        : 'ne',
                            sensibility     : 6,
                            trackDecimals   : 2,
                            trackY: false,
                            radius: 10,
                            backgroundColor: "#ffffff",
                            trackFormatter  : function (o) { return $("#data_graph_tpl").html();
                                /*var tpl = $("#data_graph_tpl").html();
                                 tpl = tpl.replace("{#_title_#}",);
                                 return $("#data_graph_tpl").html(); */}
                        },
                        crosshair : {
                            mode : 'xy',
                            color: '#ffd9a6',
                            hideCursor: false
                        },
                        xaxis: {
                            title: 't',
                            margin: false,
                            tickDecimals: 0
                        },
                        yaxis: {
                            margin: false,
                            tickDecimals: 0
                        },
                        grid: {
                            color: null,
                            verticalLines: false,
                            horizontalLines: false,
                            outlineWidth: 0
                        },
                        colors: ["#ffbe10"],
                        shadowSize: 0
                    }
                );

                $("#graph-canvas .flotr-grid-label-y").each(function(index,elem){
                    var val = Number($(this).html());
                    if (val >= 1000)
                    {
                        val = (val/1000).toFixed(1);
                        $(this).html(val + "K");
                    }
                });

                if (type == "showYear")
                {
                    $("#graph-canvas .flotr-grid-label-x").each(function(index,elem){
                        var ind = Number($(this).html());
                        $(this).html(month_arr[ind-1]);
                    });
                }
            }

            initScripts();
        }
    });
}


function updateGraph(type)
{
    var _group_id = -1;
    _cur_page = 0;
    if (_global_group_id > 0)
    {
        _group_id = _global_group_id;
    }

    $.ajax({
        url: "/DreamAjax/loadMore",
        type: "post",
        dataType: "json",
        data: {cur_page: _cur_page, group_id: _group_id,type: type, point: fixed_sel_x_my},
        success: function(data)
        {
            $("#list-events .wrap .list_item ").remove();
            var
                d1 = [],
                graph, i;

            var counter = 0;
            if (data['result'].length > 0) {
                d1.push([0, counter]);

                _cur_page += 1;
                $("#more_events").before(data['result']);
                if (data['newTotalCount'] > 0)
                {
                    data['totalCount'] = data['newTotalCount'];
                }
                if (_cur_page * 10 < data['totalCount']) {
                    if (data['totalCount'] <= 10) {
                        $("#events_count").html(data['totalCount']);
                    }
                    else {
                        $("#events_count").html(_cur_page * 10);
                    }
                    $("#more_events").show();
                }
                else {
                    $("#events_count").html(data['totalCount']);
                    $("#more_events").hide();
                }
                $("#events_maxcount").html(data['totalCount']);


                var assoc_arr = [];

                switch(type)
                {
                    case "showAll":
                        for (var k in data['graph']){
                            if (data['graph'].hasOwnProperty(k)) {

                                var t_a = k.split("-");
                                if (typeof assoc_arr[Number(t_a[1])] == "undefined" || assoc_arr[Number(t_a[1])] == undefined) {
                                    assoc_arr[Number(t_a[1])] = [];
                                    assoc_arr[Number(t_a[1])]['count'] = Number(data['graph'][k]);
                                    assoc_arr[Number(t_a[1])]['last_event'] = '';
                                }
                                else
                                {
                                    assoc_arr[Number(t_a[1])]['count'] += Number(data['graph'][k]);
                                }
                            }
                        }
                        break;
                    case "showYear":
                        for (var k in data['graph']){
                            if (data['graph'].hasOwnProperty(k)) {

                                var t_a = k.split("-");
                                if (typeof assoc_arr[Number(t_a[1])] == "undefined" || assoc_arr[Number(t_a[1])] == undefined) {
                                    assoc_arr[Number(t_a[1])] = [];
                                    assoc_arr[Number(t_a[1])]['count'] = Number(data['graph'][k]);
                                    assoc_arr[Number(t_a[1])]['last_event'] = '';
                                }
                                else
                                {
                                    assoc_arr[Number(t_a[1])]['count'] += Number(data['graph'][k]);
                                }
                            }
                        }
                        break;
                    case "showMonth":
                        for (var k in data['graph']){
                            if (data['graph'].hasOwnProperty(k)) {

                                var t_a = k.split("-");
                                if (typeof assoc_arr[Number(t_a[2])] == "undefined" || assoc_arr[Number(t_a[2])] == undefined) {
                                    assoc_arr[Number(t_a[2])] = [];
                                    assoc_arr[Number(t_a[2])]['count'] = Number(data['graph'][k]);
                                    assoc_arr[Number(t_a[2])]['last_event'] = '';
                                }
                                else
                                {
                                    assoc_arr[Number(t_a[2])]['count'] += Number(data['graph'][k]);
                                }
                            }
                        }
                        break;
                    case "showWeek":
                        for (var k in data['graph']){
                            if (data['graph'].hasOwnProperty(k)) {

                                var t_a = k.split("-");
                                if (typeof assoc_arr[Number(t_a[2])] == "undefined" || assoc_arr[Number(t_a[2])] == undefined) {
                                    assoc_arr[Number(t_a[2])] = [];
                                    assoc_arr[Number(t_a[2])]['count'] = Number(data['graph'][k]);
                                    assoc_arr[Number(t_a[2])]['last_event'] = '';
                                }
                                else
                                {
                                    assoc_arr[Number(t_a[2])]['count'] += Number(data['graph'][k]);
                                }
                            }
                        }


                        break;
                    case "showDay":
                        for (var k in data['graph']){
                            if (data['graph'].hasOwnProperty(k)) {

                                var t_a = k.split(" ");
                                if (typeof assoc_arr[Number(t_a[1])] == "undefined" || assoc_arr[Number(t_a[1])] == undefined) {
                                    assoc_arr[Number(t_a[1])] = [];
                                    assoc_arr[Number(t_a[1])]['count'] = Number(data['graph'][k]);
                                    assoc_arr[Number(t_a[1])]['last_event'] = '';
                                }
                                else
                                {
                                    assoc_arr[Number(t_a[1])]['count'] += Number(data['graph'][k]);
                                }
                            }
                        }
                        break;
                }
                /*for (var k in data['graph']){
                    if (data['graph'].hasOwnProperty(k)) {

                        var t_a = k.split("-");
                        if (typeof assoc_arr[Number(t_a[1])] == "undefined" || assoc_arr[Number(t_a[1])] == undefined) {
                            assoc_arr[Number(t_a[1])] = [];
                            assoc_arr[Number(t_a[1])]['count'] = Number(data['graph'][k]);
                            assoc_arr[Number(t_a[1])]['last_event'] = '';
                        }
                        else
                        {
                            assoc_arr[Number(t_a[1])]['count'] += Number(data['graph'][k]);
                        }
                    }
                }*/

                var iter=0;
                var counter = 0;
                for (var f in assoc_arr) {
                    counter = counter + assoc_arr[f]['count'];
                    d1.push([Number(f), counter]);
                }
                //assoc_arr.sort(function(a,b){return a['count']<b['count'];});
                global_graph_display = assoc_arr;
            }
            else
            {
                $("#more_events").hide();
            }

            graph = Flotr.draw(
                document.getElementById("graph-canvas"),
                [
                    {
                        data: d1,
                        lines : {show: true, fill : false, fillColor: "#d3f0ff" },
                        backgroundColor : '#36b7ff',
                        fillOpacity: 0.1,
                        points : { show : true }
                    }
                ],
                {
                    mouse : {
                        track           : true, // Enable mouse tracking
                        lineColor       : '#ffa836',
                        relative        : true,
                        position        : 'ne',
                        sensibility     : 6,
                        trackDecimals   : 2,
                        trackY: false,
                        radius: 10,
                        backgroundColor: "#ffffff",
                        trackFormatter  : function (o) {
                            sel_x_my = o.x;
                            return $("#data_graph_tpl").html();
                            /*var tpl = $("#data_graph_tpl").html();
                             tpl = tpl.replace("{#_title_#}",);
                             return $("#data_graph_tpl").html(); */}
                    },
                    crosshair : {
                        mode : 'xy',
                        color: '#ffd9a6',
                        hideCursor: false
                    },
                    xaxis: {
                        title: 't',
                        margin: false,
                        tickDecimals: 0,
                        tickFormatter: function(x)
                        {
                            switch(type)
                            {
                                case "showAll":

                                break;

                                case "showYear":
                                    return month_arr[x-1];
                                    break;

                                case "showMonth":
                                    console.dir(x);
                                    return x;
                                    break;

                                case "showWeek":

                                    break;

                                case "showDay":

                                    break;
                            }
                            return x;
                        }
                    },
                    yaxis: {
                        margin: false,
                        tickDecimals: 0
                    },
                    grid: {
                        color: null,
                        verticalLines: false,
                        horizontalLines: false,
                        outlineWidth: 0
                    },
                    colors: ["#ffbe10"],
                    shadowSize: 0
                }
            );

            $("#graph-canvas .flotr-grid-label-y").each(function(index,elem){
                var val = Number($(this).html());
                if (val >= 1000)
                {
                    val = (val/1000).toFixed(1);
                    $(this).html(val + "K");
                }
            });

            if (type == "showYear" || type == "showAll")
            {
                $("#graph-canvas .flotr-grid-label-x").each(function(index,elem){
                    var ind = Number($(this).html());
                    $(this).html(month_arr[ind-1]);
                });
            }

            initScripts();
        }
    });
}


function updateRightPanel(in_data_graph)
{
    var dath = $("#data_list_tpl").html();
    switch(Number(in_data_graph['event_type']))
    {
        case 1:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Group/view/" + in_data_graph['group_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Вы приняты в команду");
            break;
        case 2:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Group/view/" + in_data_graph['group_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Создание проекта в группе");
            break;
        case 3:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Project/Task/" + in_data_graph['subproject_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Создание подпроекта");
            break;
        case 4:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Project/Task/" + in_data_graph['task_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Вы создали задачу");
            break;
        case 5:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Project/Task/" + in_data_graph['task_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['tasktitle'] == null ? "" : in_data_graph['tasktitle']);
            dath = dath.replace("{#_action_#}","Вам прокомментировали задачу");
            break;
    }

    $("#list-events .wrap").prepend(dath);
}

function getParsedDataForGraph(in_data_graph)
{
    console.dir(in_data_graph);
    var dath = $("#data_graph_tpl").html();
    switch(Number(in_data_graph['event_type']))
    {
        case 1:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Group/view/" + in_data_graph['group_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Вы приняты в команду");
            break;
        case 2:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Group/view/" + in_data_graph['group_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Создание проекта в группе");
            break;
        case 3:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Project/Task/" + in_data_graph['subproject_id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Создание подпроекта");
            break;
        case 4:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Project/Task/" + in_data_graph['id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Вы создали задачу");
            break;
        case 5:
            dath = dath.replace("{#_project_created_#}",in_data_graph['date']);
            dath = dath.replace("{#_url_#}","/Project/Task/" + in_data_graph['id']);
            dath = dath.replace("{#_title_#}",in_data_graph['title'] == null ? "" : in_data_graph['title']);
            dath = dath.replace("{#_action_#}","Вы прокомментировали задачу");
            break;
    }
    
    return dath;
}

function setDream(elem)
{
    var dream_id = $(elem).attr("dream-id");
    var group_id = $(elem).attr("dream-group-id");
    var project_id = $(elem).attr("dream-project-id");
    var subproject_id = $(elem).attr("dream-subproject-id");
    var task_id = $(elem).attr("dream-task-id");
    var project_event_id = $(elem).attr("dream-project-event-id");
    var stat = $(elem).parent().hasClass("active")? 0 : 1;
    var cmt = $("#my_comment").val();

    $.ajax({
        url: "/DreamAjax/setDream",
        type: "post",
        data: {dr_id: dream_id, gr_id: group_id, pr_id: project_id, sp_id: subproject_id, ta_id: task_id, pe_id: project_event_id, status: stat,comment: cmt},
        success: function(data) {

            if (stat == 0)
            {
                $(elem).parent().removeClass("active");
            }
            else
            {
                $(elem).parent().addClass("active");
                $(elem).attr("dream-id",data);
            }
        }

    });

    return false;
}

function initScripts()
{
    $(".list_item .dream").unbind("click");
    $(".list_item .dream").click(function(e){
        e.preventDefault();
        var elem = $(this).parent().parent();
        var curr = $(this);

        var dream_id = $(elem).attr("dream-id");
        var group_id = $(elem).attr("dream-group-id");
        var project_id = $(elem).attr("dream-project-id");
        var subproject_id = $(elem).attr("dream-subproject-id");
        var task_id = $(elem).attr("dream-task-id");
        var project_event_id = $(elem).attr("dream-project-event-id");
        var stat = $(elem).attr("dream-stat") == 0 ? 1 : 0;
        var cmt = $(elem).attr("dream-comment");

        $.ajax({
            url: "/DreamAjax/setDream",
            type: "post",
            data: {dr_id: dream_id, gr_id: group_id, pr_id: project_id, sp_id: subproject_id, ta_id: task_id, pe_id: project_event_id, status: stat,comment: cmt},
            success: function(data) {
                if ($(curr).hasClass("active"))
                {
                    $(curr).removeClass("active");
                    $(elem).attr("dream-stat","0");
                }
                else
                {
                    $(curr).addClass("active");
                    $(elem).attr("dream-stat","1");
                }
                if (data > 0)
                {
                    $(elem).attr("dream-id",data);
                }
            }

        });

        return false;
    });
}