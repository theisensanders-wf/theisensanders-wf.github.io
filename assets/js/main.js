$(function () {
    // Title Scroll
    var titles = [
        ' software developer',
        'n ultimate frisbee player',
        ' student',
        ' python enthusiast',
        'n amateur golfer',
        'n Iowa State Cyclone',
        ' computer science major',
        'n investor'
    ];

    var counter = 0;
    setInterval(function () {
        $("#titles").fadeOut(500, function () {
            $(this).text(titles[counter]).fadeIn(500);
        });

        counter++;
        if (counter == titles.length) {
            counter = 0;
        }
    }, 3333);
});

$(document).ready(function ($) {

    // Sidebar Toggle

    $('.btn-navbar').click(function () {
        $('html').toggleClass('expanded');
    });


    // Slide Toggles

    $('#section3 .button').on('click', function () {

        var section = $(this).parent();

        section.toggle();
        section.siblings(".slide").slideToggle('2000', "easeInQuart");
    });

    $('#section3 .read-more').on('click', function () {

        var section = $(this).parent();

        section.toggle();
        section.siblings(".slide").slideToggle('2000', "easeInQuart");
    });

    $('#section4 .article-tags li').on('click', function () {

        var section = $(this).parents('.span4');
        var category = $(this).attr('data-blog');
        var articles = section.siblings();

        // Change Tab BG's
        $(this).siblings('.current').removeClass('current');
        $(this).addClass('current');

        // Hide/Show other articles
        section.siblings('.current').removeClass('current').hide();

        $(articles).each(function (index) {

            var newCategory = $(this).attr('data-blog');

            if (newCategory == category) {
                $(this).slideDown('1000', "easeInQuart").addClass('current');
            }
        });

    });


    // Waypoints Scrolling

    var links = $('.navigation').find('.scroll-points').find('li');
    var button = $('.intro button');
    var section = $('section');
    var mywindow = $(window);
    var htmlbody = $('html,body');


    section.waypoint(function (direction) {

        var datasection = $(this).attr('data-section');

        if (direction === 'down') {
            $('.navigation li[data-section="' + datasection + '"]').addClass('active').siblings().removeClass('active');
        }
        else {
            var newsection = parseInt(datasection) - 1;
            $('.navigation li[data-section="' + newsection + '"]').addClass('active').siblings().removeClass('active');
        }

    }, {offset: '50%'});

    mywindow.scroll(function () {
        if (mywindow.scrollTop() == 0) {
            $('.navigation li[data-section="1"]').addClass('active');
            $('.navigation li[data-section="2"]').removeClass('active');
        }
    });

    function goToByScroll(datasection) {

        if (datasection == 1) {
            htmlbody.animate({
                scrollTop: $('.section[data-section="' + datasection + '"]').offset().top
            }, 500, 'easeOutQuart');
        }
        else {
            htmlbody.animate({
                scrollTop: $('.section[data-section="' + datasection + '"]').offset().top + 70
            }, 500, 'easeOutQuart');
        }

    }

    links.click(function (e) {
        e.preventDefault();
        var datasection = $(this).attr('data-section');
        goToByScroll(datasection);
    });

    button.click(function (e) {
        e.preventDefault();
        var datasection = $(this).attr('data-section');
        goToByScroll(datasection);
    });

    // Redirect external links

    $("a[rel='external']").click(function () {
        this.target = "_blank";
    });

    // Modernizr SVG backup

    if (!Modernizr.svg) {
        $('img[src*="svg"]').attr('src', function () {
            return $(this).attr('src').replace('.svg', '.png');
        });
    }

    // Contact Form
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var form = $('#contact-form');
    form.submit(function () {
        var data = $(this).serializeObject();
        $.ajax({
            type: 'POST',
            url: '/contact',
            data: data,
            dataType: 'json'
        });
    });
    return false;


});
