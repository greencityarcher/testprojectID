var normalizeX;
var normalizeY;

//функция нормализации размеров изображения относительно контейнера
//для более удобного просмотра больших изображений в маленьком контейнере
function normalize(elem, axis) {
    if ((axis == "X") || (axis == "x")) {
        return ((elem.children('.photo').width() - elem.width()) / elem.width());
    } else {
        return ((elem.children('.photo').height() - elem.height()) / elem.height());
    }
}

$('.hoverable').on('mouseover', function(e) {
    //вычисляем отношение перемещения по контейнеру к эквивалентному перемещению по  изображению
    normalizeX = normalize($(this), 'x');
    normalizeY = normalize($(this), 'y');
});

$('.hoverable').on('mousedown', function(e) {
    e.preventDefault();
})

$(document).on('mousemove', '.hoverable', function(e) {
    //вычисляем, насколько сместить изображение внутри контейнера
    var offsetX = (Math.floor(((e.pageX - $(this).offset().left) * normalizeX) * 10) / 10) * -1;
    var offsetY = (Math.floor(((e.pageY - $(this).offset().top) * normalizeY) * 10) / 10) * -1;
    //задаем смещение изображению
    $(this).children('.photo').css({
        'left': offsetX,
        'top': offsetY
    });
});


$(".draggable").on('mousedown', function(e) {
    e.preventDefault();
    var offsetX;
    var offsetY;
    var posX;
    var posY;
    //максимальное смещение в пределах контейнера
    maxPosX = $(this).children('.photo').width() - $(this).width();
    maxPosY = $(this).children('.photo').height() - $(this).height();
    //начальное положение при перетаскивании
    pointX = e.pageX - $(this).children('.photo').offset().left;
    pointY = e.pageY - $(this).children('.photo').offset().top;
    //позволяем перемещение
    $(this).addClass('moveable');
});

//запрещаем перемещение при отпускании мыши
$(".draggable").on('mouseup', function(e) {
    $(this).removeClass('moveable');
});
//и при выходе за пределы контейнера
$(".draggable").on('mouseout', function(e) {
    $(this).removeClass('moveable');
});
$(".draggable").on('mouseenter',function(e){
  if (e.which === 1){
  $(this).addClass('moveable');  
  }

})


$(document).on('mousemove', '.moveable', function(e) {
    //вычисляем перемещение
    offsetX = ((e.pageX - $(this).children('.photo').offset().left) - pointX);
    offsetY = ((e.pageY - $(this).children('.photo').offset().top) - pointY);
    //вычисляем итоговые координаты
    posX = parseInt(($(this).children('.photo').css('left')), 10) + offsetX;
    posY = parseInt(($(this).children('.photo').css('top')), 10) + offsetY;
    //если выходим за пределы контейнера по высоте
    if ((posY > 0) || (posY < (maxPosY * -1))) {
        //проверяем, если вышли по ширине
        if ((posX > 0) || (posX < (maxPosX * -1))) {
            return;
        } else {
            $(this).children('.photo').css({
                'left': posX + 'px'
            });
        }
    } else {
        //проверяем, если вышли по ширине
        if ((posX > 0) || (posX < (maxPosX * -1))) {
            $(this).children('.photo').css({
                'top': posY + 'px'
            });
        }
        //все в пределах контейнера
        else {
            $(this).children('.photo').css({
                'left': posX + 'px',
                'top': posY + 'px'
            });
        }
    }
});
