/* global app */
app.controller('Principal', function ($scope, Service) {

    $scope.editPropertyComponetId = null;
    $scope.editPropertyComponetSubId = null;
    $scope.slider = {
        nome:"",
        animation: ""
    };

    $scope.contadorobjview = 0;
    $scope.objview = {
        id: 0,
        index: 0,
        tipo: "",
        id_elemento: ""
    };
    $scope.listObjView = new Array();

    $scope.objSlider = {
        id: 0,
        view_html: "",
        view_img: "",
        index: 0,
        actions: '',
        animations: ''
    };
    $scope.sliders = new Array();

    /**
     * Mostrar preview dos evefeitos para a pagina
     * @param {type} ap
     * @returns {undefined}
     */
    var showPreviewApresetation = function (ap) {
        var list = ['flipInY', 'slideInLeft', 'slideInRight', 'slideInDown', 'slideInUp', 'rotateInDownRight', 'rotateInUpLeft', 'bounceInRight', 'zoomIn'];

        for (var i = 0; i < list.length; i++) {
            $('#container-create-apresentation').removeClass(list[i]);
        }
        setTimeout(function () {
            $('#container-create-apresentation').addClass(ap);
        }, 100);
    };

    /**
     * Abilitar o EditorText quill nos campos
     * @param {type} el
     * @returns {undefined}
     */
    var abiliteEditorText = function (editor, idElemento) {
        if (editor) {
            editor.mousedown(function (e) {
                switch (e.which) {
                    case 1:
                        e.stopPropagation();
                        break;
                    case 2:
                        e.stopPropagation();
                        break;
                    case 3:
//                                e.stopPropagation();
                        break;
                    default:
                        alert('You have a strange mouse');
                }
            });
            if (editor) {
                $(function () {
                    var toolbarOptions = [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{'header': 1}, {'header': 2}], // custom button values
                        [{'list': 'ordered'}, {'list': 'bullet'}],
                        [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
                        [{'indent': '-1'}, {'indent': '+1'}], // outdent/indent
                        [{'direction': 'rtl'}], // text direction
                        [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
                        [{'header': [1, 2, 3, 4, 5, 6, false]}],
                        [{'color': []}, {'background': []}], // dropdown with defaults from theme
                        [{'font': []}],
                        [{'align': []}],
                        ['clean']
                    ];
                    var quill = null;
                    editor.html("<div id=\"" + idElemento + "\"></div>");
                    quill = null;
                    quill = new Quill('#' + idElemento, {
                        modules: {
                            toolbar: toolbarOptions
                        },
                        theme: 'bubble'
                    });

                });
            }
        }
    };

    /**
     * Ativar hover nos elementos
     * @param {type} el
     * @returns {undefined}
     */
    var ativarhover = function (el) {
        $(function () {
            $(el).hover(
                    function () {
                        var modelHover = $(this).find(".ui-as-model-hv");
                        if (modelHover) {
                            if (modelHover.is(":visible")) {
                                modelHover.hide();
                            } else {
                                modelHover.show();
                            }
                        }
                    }
            );
        });
    };

    var validarSeExisteIgualElemento = function (id_elemento, lista) {
        for (var i = 0; i < lista.length; i++) {
            if (id_elemento == lista[i]['id_elemento']) {
                return true;
            }
        }
        return false;
    };
    var encontrarIdParaNovoElemento = function (nome_tipo) {
        var count = 1;
        var idElemento = 'ui-id-' + nome_tipo;
        var validateIdEl = true;
        var lista = $scope.listObjView;
        while (validateIdEl) {
            var elAux = idElemento + '-' + count;
            if (validarSeExisteIgualElemento(elAux, lista)) {
                count++;
            } else {
                idElemento = elAux;
                validateIdEl = false;
            }
        }
        return idElemento;
    };

    /**
     * Adiciona o droppable
     * @returns {undefined}
     */
    var constructview = function () {
        $(function () {
            // Adicionando efeito de clck nas div's
            $('#preview-animation').click(function () {
                showPreviewApresetation($('#selectAnimation').val());
            });
            //adicionos os slides a lista
            $('#add-slide-apresetation').click(function () {
                var slide = $('#container-create-apresentation').html();
                var obj = {
                    index: 0,
                    slide: slide,
                    actions: '',
                    animations: '',
                    print: null
                };
                /**
                 * Dentro desta função cria uma imagem a partir do slide de apresentção criado no frame
                 */
                $(document).ready(function () {
                    var target = $('#container-create-apresentation');
                    html2canvas(target, {
                        onrendered: function (canvas) {
                            var img = canvas.toDataURL("image/png");
                            if (img) {
                                obj.index = $scope.sliders.length + 1;
                                obj.print = img;
                                obj['listobjview'] = $scope.listObjView;
                                obj['animation'] = $scope.slider.animation;
                                $scope.sliders.push(obj);
                                $scope.refresc();
                            }
                        }
                    });
                });

            });
            //drop view menu
            $(".droppable").droppable({
                drop: function (event, ui) {
                    var copy = true;
                    if (ui.draggable[0].attributes['copy'] && ui.draggable[0].attributes['copy'].value && ui.draggable[0].attributes['copy'].value == "false") {
                        console.log(ui.draggable[0].attributes['copy']);
                        copy = false;
                    }

                    if (copy) {
                        var objElemento = {
                            id: 0,
                            index: $scope.listObjView.length + 1,
                            tipo: "",
                            id_elemento: "",
                            pai_id_elemento: ""
                        };
                        var listaDragEl = $(ui.draggable[0].innerHTML);
                        var dragEl = $($(listaDragEl)[0]);
                        var context = dragEl.context.className;

                        if (context && context.indexOf('ui-as-texteditor') > -1) {
                            objElemento['tipo'] = 'texteditor';
                        } else if (context && context.indexOf('ui-as-btn') > -1) {
                            objElemento['tipo'] = 'button';
                        } else if (context && context.indexOf('ui-as-img') > -1) {
                            objElemento['tipo'] = 'img';
                        } else if (context && context.indexOf('ui-as-video') > -1) {
                            objElemento['tipo'] = 'video';
                        }

                        if (objElemento.tipo && objElemento.tipo !== "") {
                            objElemento['id_elemento'] = encontrarIdParaNovoElemento(objElemento.tipo);
                            if (objElemento.id_elemento && objElemento.id_elemento !== "") {

                                objElemento['pai_id_elemento'] = "pai-id_" + objElemento.id_elemento;
                                dragEl.addClass(objElemento['id_elemento']);

                                var elPaiId = objElemento['pai_id_elemento'];
                                var el = $.parseHTML('<div copy="false" class="ui-componet-drag-content ui-widget-content ' + elPaiId + '"></div>');

                                $(el).append(dragEl);
                                if (listaDragEl && listaDragEl.length > 1) {
                                    for (var i = 1; i < listaDragEl.length; i++) {
                                        $(listaDragEl[i]).attr('data-id-ref', objElemento.id_elemento);
                                        $(el).append($(listaDragEl[i]));
                                    }
                                }
                                $(this).append(el);

                                $(function () {
                                    $("." + elPaiId).draggable({
                                        containment: "parent",
                                        cursor: "move",
                                        snap: ".painel-education-md"
                                    });
                                    $("." + elPaiId).resizable({
                                        helper: "ui-resizable-helper",
                                        animate: false
                                    });
                                    $("." + elPaiId).resize(function (e) {
                                        e.preventDefault();
                                        $scope.atualizarPropertyResize(e);
                                    });
                                    $(el).hover(
                                            function () {
                                                var modelHover = $(this).find(".ui-as-model-hv");
                                                var attrRef = modelHover.attr('data-id-ref');
                                                if (modelHover) {
                                                    var btns = modelHover.find('button');
                                                    if (btns) {
                                                        for (var i = 0; i < btns.length; i++) {
                                                            $(btns[i]).attr('data-id-ref', attrRef);
                                                        }
                                                    }
                                                    if (modelHover.is(":visible")) {
                                                        modelHover.hide();
                                                    } else {
                                                        modelHover.show();
                                                    }
                                                }
                                            }
                                    );
                                });

                                if (objElemento['tipo'] == "texteditor") {
                                    abiliteEditorText($(el).find('.' + objElemento['id_elemento']), objElemento['id_elemento']);
                                }
                                $scope.listObjView.push(objElemento);
                                $('button').on("click", function (e) {
                                    $scope.btnOptions(e);
                                });
                            }
                        }
                    }
                }
            });
        });
    };
    constructview();

    $scope.deleteArray = function ($index, $arr) {
        delete $arr[$index];
        return $arr.filter(function (a) {
            return typeof a !== 'undefined';
        });
    };

    $scope.removerSlider = function ($index, $nomeDoArray) {
        $scope[$nomeDoArray] = $scope.deleteArray($index, $scope[$nomeDoArray]);
        var i = 1;
        for (var item in $scope[$nomeDoArray]) {
            $scope[$nomeDoArray][item]['index'] = i;
            i++;
        }
    };

    $scope.ordernar = function ($index, $obj) {
        try {
            $obj['index'] = $index + 1;
        } catch (e) {
            console.log(e);
        }
        return $obj;
    };

    $scope.btnOptions = function ($event) {
        $event.preventDefault();
        var el = $($event.currentTarget);
        var id = el.attr('data-id-ref');
        var method = el.attr('method');

        switch (method) {
            case 'remove':
                if ($scope.listObjView) {
                    var index = -1;
                    for (var i = 0; i < $scope.listObjView.length; i++) {
                        if ($scope.listObjView[i].id_elemento == id) {
                            index = i;
                            break;
                        }
                    }
                    if (index > -1) {
                        $scope.listObjView = $scope.deleteArray(index,$scope.listObjView);
                        $('.pai-id_' + id).remove();
                    }
                }
                break;
            case 'changeconf':
                $scope.editPropertyComponetId = id;
                $scope.aditProperty($('.pai-id_' + $scope.editPropertyComponetId));
                break;
            case 'addimg':
                $('#addimg').attr('data-id-ref', id).show();
                break;
            case 'addvideo':
                $('#addvideo').attr('data-id-ref', id).show();
                break;
            default:
                break;
        }
    };

    $scope.aditProperty = function (el) {
        if (el && el.length > 0) {
            $scope.property = {};
            $scope.property['width'] = $(el).width();
            $scope.property['height'] = $(el).height();
            $scope.refresc();
        }
    };

    $scope.atualizarPropertyResize = function ($e) {
        if ($scope.editPropertyComponetId && $e) {
            $scope.property['width'] = $($e.target).width();
            $scope.property['height'] = $($e.target).height();
            $scope.property['texto'] = $($e.target).text();
            $scope.refresc();
        }
    };
    $scope.atualizarProperty = function ($property, $value, $filho) {
        if ($property && $property == 'texto') {
            $('.' + $scope.editPropertyComponetId).text($value);
        } else {
            if ($scope.editPropertyComponetId && $property && $value) {
                if ($filho) {
                    $('.' + $scope.editPropertyComponetId).css($property, $value);
                } else {
                    $('.pai-id_' + $scope.editPropertyComponetId).css($property, $value);
                }

            }
        }
    };

    $scope.atualizarImg = function ($value) {
        var id = $('#addimg').attr('data-id-ref');
        if ($scope.listObjView && $value) {
            var list = $scope.listObjView;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id_elemento === id) {
                    $('.' + id).attr('src', $value);
                    var obj = list[i];
                    obj['attr'] = {src: $value};
                    list[i] = obj;
                    break;
                }
            }
        }
        $('#addimg').hide();
    };

    $scope.atualizarVideo = function ($value) {
        var id = $('#addvideo').attr('data-id-ref');
        if ($scope.listObjView && $value) {
            var list = $scope.listObjView;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id_elemento === id) {
                    $('.' + id).attr('data', $value);
                    var obj = list[i];
                    obj['attr'] = {data: $value};
                    list[i] = obj;
                    break;
                }
            }
        }
        $('#addvideo').hide();
    };
    
    $scope.newObjView = function () {
        $scope.listObjView = new Array();
        $('#container-create-apresentation').html('');
    };
    
    $scope.salvarTudo = function () {
        if (!$scope.slider && !$scope.slider.nome) {
            return;
        }
        if (!$scope.sliders) {
            return msgWarnig("Necessário informar todos os dados.")
        }
        var nomeSlider = $scope.slider.nome;
        var args = {
            action: "slider",
            user: {},
            data: {
                action: "new",
                obj: {
                    slider: $scope.sliders,
                    nome: nomeSlider
                }
            }
        };
        Service.callWss(args, onComplete, onSuccess, onError);
    };

    var onComplete = function (args, result) {
        $(function () {
            $(".loader").removeClass("display-on").addClass("display-off");
        });
    };
    var onSuccess = function (args, result) {
        try {
            if (result && result.success) {
                swal({
                    title: "Sucesso!",
                    text: result.message,
                    icon: "success",
                    button: "OK"
                });
            }
        } catch (e) {
            onError(args, result);
        }
    };
    var onError = function (args, result) {
        var notificar = true;
        try {
            if (result && result.error) {
                swal({
                    title: "Ops!",
                    text: result.message,
                    icon: "warning",
                    button: "OK"
                });
            }
            notificar = false;
        } catch (e) {
        }
        if (notificar) {
            swal({
                title: "Ops!",
                text: "Ops! Ocorreu um erro tente mais tarde. Obrigado.",
                icon: "warning",
                button: "OK"
            });
        }
    };

    var msgWarnig = function (mensagem) {
        swal({
            title: "Ops!",
            text: mensagem ? mensagem : "Ops! ocorreu uma falha!",
            icon: "warning",
            button: "OK"
        });
    };

    $scope.refresc = function () {
        try {
            setTimeout(function () {
                $scope.$apply(function () {});
            }, 1);
        } catch (e) {/*ERROR*/
        }
        return;
    };

    $scope.view = function (view) {
        var onReturn = function () {
            refresc();
        };
        if (view) {
            Service.view(view, onReturn);
        }
    };

    $scope.page = function ($page) {
        $('#' + $page).addClass("fadeInLeft");
    };

    $scope.newUser = function ($user, $pessoa) {
        if (!$user || !$pessoa) {
            return msgWarnig("Necessário informar todos os dados.")
        }
        var args = {
            action: "user",
            user: $user,
            data: {
                action: "new",
                obj: {
                    user: $user,
                    pessoa: $pessoa
                }
            }
        };
        Service.callWss(args, onComplete, onSuccess, onError);
    };
});