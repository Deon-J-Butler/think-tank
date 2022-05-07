$(document).ready(function(){
    $('.delete-thought').on('click', function(e){
        let $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/thoughts/'+id,
            success: function(){
                confirm('You selected to delete this entry.');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});