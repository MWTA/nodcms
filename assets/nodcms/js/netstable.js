(function ( $ ) {
    $.fn.nodcmsNetstable = function () {
    var $list = $(this),
        $saveBtn = $($list.data('savebtn')),
        $output = $list.find('.sort-text-output');
    var updateOutput = function (e) {
        var list = e.length ? e : $(e.target);
        // Update new sort in out-put textarea
        if (window.JSON) {
            $output.val(window.JSON.stringify(list.nestable('serialize'))); //, null, 2));
            $saveBtn.removeClass('hidden');
        } else {
            toastr.error('JSON browser support required for this action.', 'Error');
        }
    };

    $saveBtn.click(function() {
        var saveSortBtn = $(this);
        var output = $list.find('.sort-text-output');
        $.ajax({
            url: saveSortBtn.data('url'),
            data: {'data':output.val()},
            type:'post',
            dataType: 'json',
            beforeSend: function () {
                saveSortBtn.attr('disabled','disabled').addClass('disabled').prepend($("<i class='fas fa-spinner fa-pulse fa-fw'></i>"));
            },
            complete:function () {
                saveSortBtn.removeAttr('disabled').removeClass('disabled').find('i.fas.fa-spinner').remove();
            },
            success: function (resullt) {
                if(resullt.status=='error') {
                    toastr.error(resullt.error, translate('Error'));
                }else if(resullt.status=='success'){
                    output.addClass('hidden').val('');
                    saveSortBtn.addClass('hidden');
                    toastr.success(resullt.msg, translate('Success'));
                }
            },
            error: function (xhr, status, error) {
                $.showInModal(translate('Error')+': '+translate('Ajax failed!'), '<div class="alert alert-danger">' +
                    '<h4>'+translate('Error')+'</h4>' +
                    error +
                    '</div>' +
                    '<h4>'+translate('Result')+'</h4>' +
                    xhr.responseText);
            }
        });
    });

    $list.nestable({
        maxDepth: 1
    }).on('change', updateOutput);
};
}( jQuery ));
$(function () {
    $('.nodcms-sortable-list').nodcmsNetstable();
});