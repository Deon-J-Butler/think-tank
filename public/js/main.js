$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        let $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/articles/'+id,
            success: function(){
                confirm('You selected to delete this article.');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});