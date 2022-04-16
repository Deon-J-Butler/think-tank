$(document).ready(function(){
    $('.delete-article').on('click', function(e){
        let $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/article/'+id,
            success: function(){
                alert('Article Deleted. Returning to Home...');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});