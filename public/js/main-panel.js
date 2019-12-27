// $(window).on('resize', function() {
//     $('#header .row').innerWidth( $('#header').width() - 180 );
//     $('#searchInput').width( ($('#header .col-xs-6').width()) - 100 );
// });


// JS COOKIE SCRIPTS

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; path=/; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

// Внутренние переменные
var canvas, ctx;
var clockRadius = 20;
var clockImage;
var allowReplace = false;

// Функции рисования:
function clear() { // Очистка поля рисования
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // Основная функция drawScene
	clear(); // Очищаем поле рисования

	// Получаем текущее время
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	hours = hours > 12 ? hours - 12 : hours;
	var hour = hours + minutes / 60;
	var minute = minutes + seconds / 60;

	// Сохраняем текущий контекст
	ctx.save();

	// Рисуем изображение часов (как фон)
	ctx.drawImage(clockImage, 0, 0, 40, 40);

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.beginPath();

	// Рисуем часовую стрелку
	ctx.save();
	var theta = (hour - 3) * 2 * Math.PI / 12;
	ctx.rotate(theta);
	ctx.beginPath();
	ctx.moveTo(-6, -1);
	ctx.lineTo(-6, 1);
	ctx.lineTo(clockRadius * 0.5, 1);
	ctx.lineTo(clockRadius * 0.5, -1);
	ctx.fillStyle = '#ff6363';
	ctx.fill();
	ctx.restore();

	// Рисуем минутную стрелку
	ctx.save();
	var theta = (minute - 15) * 2 * Math.PI / 60;
	ctx.rotate(theta);
	ctx.beginPath();
	ctx.moveTo(-6, -1);
	ctx.lineTo(-6, 1);
	ctx.lineTo(clockRadius * 0.7, 1);
	ctx.lineTo(clockRadius * 0.7, -1);
	ctx.fillStyle = '#00b6af';
	ctx.fill();
	ctx.restore();

	// Рисуем секундную стрелку
	ctx.save();
	var theta = (seconds - 15) * 2 * Math.PI / 60;
	ctx.rotate(theta);
	ctx.beginPath();
	ctx.moveTo(-8, -0.5);
	ctx.lineTo(-8, 0.5);
	ctx.lineTo(clockRadius * 0.8, 0.5);
	ctx.lineTo(clockRadius * 0.8, -0.5);
	ctx.fillStyle = '#ffbb00';
	ctx.fill();
	ctx.restore();

	// центральный круг
	ctx.save();
	ctx.beginPath();
	ctx.arc(0, 0, 2, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#ffbb00';
	ctx.stroke();
	ctx.restore();

	ctx.restore();
}

// Инициализация
$(function(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

	// var width = canvas.width;
	// var height = canvas.height;

	clockImage = new Image();
	clockImage.src = '/img/interface/clock.png';

	setInterval(drawScene, 100); // Циклическое выполнение функции drawScene
});


// Chart

/*
function parseDate(input) {
	var parts = input.split('-');
	// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
	return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

// отрисовка чарта
function drawChart(chartData, maximum) {
	var data = new google.visualization.DataTable();
	//var data = new google.visualization.DataTable(chartData);
	data.addColumn('date', 'Day');
	data.addColumn('number', 'tasks');
	data.addRows(chartData);

	if(maximum < 10) maximum = 10;
	var minDate = new Date(chartData[0][0]);
	minDate.setDate(minDate.getDate()-1);
	var maxDate = new Date(chartData[chartData.length-1][0]);
	if( chartData[0][0] == chartData[chartData.length-1][0] ) {
		maxDate.setDate(maxDate.getDate()+40);
	} else {
		maxDate.setDate(maxDate.getDate()+1);
	}

	var options = {
		title: '',
		curveType: 'none',
		legend: 'none',
		colors: ['#52B0A7'],
		pointSize: 4,
		lineWidth: 1,
		hAxis: {
			baseline: minDate,
			viewWindow: {
				min: minDate,
				max: maxDate,
			},
		},
		vAxis: {
			baseline: 0,
			gridlineColor: '#ddd',
			textPosition: 'left',
			viewWindowMode: 'pretty',
			viewWindow: {
				min: 0,
				max: (maximum+1),
			},
			//maxValue: parseInt(maximum),
		},
		chartArea: {width:"95%", height: "90%"},
	};

	var chart = new google.visualization.LineChart(document.getElementById('dream_chart'));

	chart.draw(data, options);

	$('.myLinks .overlay').hide();
	$('.myLinks .group-select').show();
}

$(document).ready(function(){
	$('#DreamGrouplist').styler({
		onSelectOpened: function() {
			allowReplace = true;
		}
	});

	$('#DreamGrouplist').on('change', function() {
		if( $(this).val() != 'create' ) {
			setCookie('dream-chart', $(this).val(), 30);

			$('.myLinks .overlay').show();
			$.post("/GroupAjax/dreamStats/" + $(this).val() + '.json', (function (respose) {
				if(respose.data) {
					//var chartData = $.map( $.parseJSON(respose.data.state)  , function(el, key) { return [[key, el]]; });
					var chartData = $.map( $.parseJSON(respose.data.state)  , function(el, key) { return [[new parseDate(key), el]]; });

					google.setOnLoadCallback( drawChart(chartData, respose.data.count) );
					$(".myLinks .group-logo").attr("src", respose.data.logo);
				}
			}));
		} else {
			console.log(allowReplace);
			if(allowReplace) {
				location.replace('/Group/edit');
			}
		}
		allowReplace = false;
	});

	$('#DreamGrouplist').change();
});
*/