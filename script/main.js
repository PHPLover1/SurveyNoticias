// флаг домашней сраницы
var is_login = false;

var selectBanner = 0;
var newBanner = 0;
var bannerCount = 3;
var waitseconds = 3;
var Timer, TimerBut;

/**
 * Предзагрузка изораженией
 */
function preloadImages()
{
  for(var i = 0; i<arguments.length; i++)
    $("<img />").attr("src", arguments[i]);
}

// Обработчик загрузки кнопки подтверждения
function LoadTic() {
    waitseconds--;

    $(".butloading").html("Por favor, aguarde: " + waitseconds + " segundos" +
    ((waitseconds < 2) ? "" : (waitseconds < 5) ? "" : "") + "...");

    if (waitseconds <= 0) {
        //$(".butloading").hide();
        $(".butloading").hide();
        $(".butlink").show();
        $("input[class='btn']").attr("disabled", "");
        clearInterval(TimerBut);
    }
}

// Инициализация загрузчика
function LoadSubmitBut() {
    waitseconds++; 
    LoadTic();
    $(".getBonusForm").hide();
    TimerBut = setInterval("LoadTic();", 1000);
}

$(function() {
    
});


function changeBanner(nBanner) {
	if (nBanner != selectBanner && newBanner == selectBanner) {
	
		// сразу запоминаем что мы находимся в цикле смены баннера
		newBanner = nBanner;
		if (newBanner >= bannerCount) newBanner = 0;
		if (newBanner < 0) newBanner = bannerCount - 1;

		// Скролим текст влево
		$("#banner .item").eq(selectBanner).children(".title3").animate({left: -500}, 400)
		$("#banner .item").eq(selectBanner).children(".title2").animate({left: -500}, 400)
		$("#banner .item").eq(selectBanner).children(".title1").animate({left: -500}, 400, function() {
			// Скрывем баннер как текст уехал
			$("#banner .item").eq(selectBanner).fadeOut(500);
			// показываем новый баннер
			$("#banner .item").eq(newBanner).fadeIn(500, function() {
				// Как вылез новый баннер возвращаем текст
				$("#banner .item").eq(selectBanner).children(".title1").animate({left: 40}, 400);
				$("#banner .item").eq(selectBanner).children(".title2").animate({left: 40}, 400);
				$("#banner .item").eq(selectBanner).children(".title3").animate({left: 36}, 400);
			});
			// выбираем новый баннер
			selectBanner = newBanner;
		});
	}
}

function nextBanner() {
	changeBanner(selectBanner + 1);
}

function previousBanner() {
	changeBanner(selectBanner - 1);
}

/**
 * После полной загрузки картинки
 */
$(window).load(function() {
	// запускаем таймер	
    if (!is_login)
		Timer = window.setInterval("nextBanner()", 6000);
});


/**
 * Обработка при загрузке страницы
 */
$(function() {

	// определяем залогинен ли юзер
	if (!$("#loginblock").length)
		is_login = true;
		
	// скрываем ненужные баннеры
	for (i = 1; i < bannerCount; i++) { 
		// прячем текст
		$("#banner .item").eq(i).children(".title1").css("left", "-500px");
		$("#banner .item").eq(i).children(".title2").css("left", "-500px");
		$("#banner .item").eq(i).children(".title3").css("left", "-500px");
		// прячем баннер
		$("#banner .item").eq(i).hide();
	}
	
	// Обработка клика по селектору в шапке
	$(".selectors .left").click(function() {
		clearInterval(Timer);
		previousBanner();
		Timer = window.setInterval("nextBanner()", 6000);
	});
	
	// Обработка клика по селектору в шапке
	$(".selectors .right").click(function() {
		clearInterval(Timer);
		nextBanner();
		Timer = window.setInterval("nextBanner()", 6000);
	});
	
	// Подгружаем динамиеские картинки
	preloadImages(
		"images/selectoractive.png"
	);

	// Открываем и скрываем блок авторизации
	$("#loginlink").click(function() {
		if ($("#loginblock").css("display") == "none") {
			$("#loginblock").fadeIn(300, function() {
				//$("#loginblock input").first().focus();
			});
		} else {
			$("#loginblock").fadeOut(250);
		}
		return false;
	});
	
        // Очищаем текст по умолчанию в форме авторизации при наведении
        $('input[name="a_login"]').focus(function() {
            login = $(this).attr("value");
            if (login == "Seu e-mail") $(this).attr("value", "");
        });
        $('input[name="a_login"]').focusout(function() {
            login = $(this).attr("value");
            if (login == "") $(this).attr("value", "Ваш E-mail");
        });
        $('input[name="a_password"]').focus(function() {
            password = $(this).attr("value");
            if (password == "*****") $(this).attr("value", "");
        }); 
        $('input[name="a_password"]').focusout(function() {
            password = $(this).attr("value");
            if (password == "") $(this).attr("value", "*****");
        });

        $('#loginf').submit(function() {
		login = $('input[name="a_login"]').attr("value");
		password = $('input[name="a_password"]').attr("value");
        
        if (login == "" || login == "Логин" || password == "" || password == "*****")
            return false;
        
        return true;
    });

    // показываем форму при запуске если нужно
    if (document.location.hash == "#login") {
            $("#loginblock").fadeIn(30);
    }

    // показываем форму при запуске если нужно
    if (document.location.hash == "#registration") {
            $("#regblock input").first().focus();
    }

    // Выбор способа оплаты
    $("input[name='ac_cashtype']").change(function() {
        var cashtype = $(this).attr("value");
        var cashhint = "";
        
        $(".payicon img").attr("src", "/site_images/cash/" + cashtype + ".png");
        switch (cashtype) {
            case "0": cashhint = "R123456789012"; break
            case "1": cashhint = "12345678901234"; break
            case "2": cashhint = "+7 123 4567890"; break
        }
        $("#cashhint").html(cashhint);
    });
        
    // для реферальной страницы
    $(".link").focus(function() {
        $(this).select();
    });
    
    // для ссылки на странице заработка
    $(".butlink").click(function() {
        $(".getBonusForm").show();
        $(".getBonusForm input[type=text]").focus();
        $(this).hide();
    });
});