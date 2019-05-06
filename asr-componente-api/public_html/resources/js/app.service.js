/* global app */
app.service('Service', function ($http, $rootScope, $location) {
    var logs = function (e) {
        console.log(e);
        return;
    };
    this.logs = function (e) {
        logs(e);
    };
    this.view = function (e, onReturn) {
        $location.path(e);
        onReturn();
    };
    this.callWss = function (args, onComplete, onSuccess, onError) {
        $(function () {
            $(".loader").removeClass("display-off").addClass("display-on");
        });

//        var protocol = window.location.protocol;
//        var host = window.location.host;
        var protocol = "http:";
        var host = "localhost";
        var hostpath = 'api/controllers/wss.php';
        var url = protocol + '//' + host + '/' + hostpath;
        var method = 'POST';
        try {
            $.ajax({
                url: url,
                method: method,
                dataType: "application/json;",
                data: JSON.stringify(args),
                async: true
            }).always(function (data) {
                var result = {};
                if (data && data.responseText) {
                    try {
                        result = JSON.parse(data.responseText);
                    } catch (e) {
                        logs(e);
                    }
                    if (result && result.error) {
                        onError(args, result);
                    } else if (result && result.success) {
                        onSuccess(args, result);
                    }
                }
                if (onComplete) {
                    onComplete(args, result);
                }
            });
        } catch (e) {
            onComplete(args, {error: true, message: 'Error, tente mais tarde. Obrigado.'});
        }
    };

});