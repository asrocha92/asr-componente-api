/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 * @author Alex Santos Rocha
 * @date 28/04/2019
 */
var sliders = new Array();

/**
 * Mostrar preview dos evefeitos para a pagina
 * @param {type} ap
 * @returns {undefined}
 */
var showPreviewApresetation = function (ap) {
    var list = ['flipInY','slideInLeft', 'slideInRight', 'slideInDown', 'slideInUp', 'rotateInDownRight', 'rotateInUpLeft', 'bounceInRight', 'zoomIn'];

    for (var i = 0; i < list.length; i++) {
        $('#container-create-apresentation').removeClass(list[i]);
    }
    setTimeout(function () {
        $('#container-create-apresentation').addClass(ap);
    }, 100);
};

/**
 * Adicionando efeito de clck nas div's
 */
$('#preview-animation').click(function () {
    showPreviewApresetation($('#selectAnimation').val());
});


