$(document).ready(function() {

    $(document).on('click', '.btn-article', saveArticles);
    $(document).on('click', '.btn-remove', removeArticles);
    $(document).on('click', '.btn-comment', showComments);
    $(document).on('click', '.btn-delete-comment', deleteComment);

    
    function articleBuilder(articles, user){
        if(window.location.pathname === "/articles"){
            $("#articles-window").html('');
            articles.reverse().forEach(function(article){
                var newDiv = $('<div>');
                newDiv.addClass("panel panel-default")
                newDiv.html(
                    "<div class='panel-heading'>" +
                        "<h2 class='panel-title'><a href='" + article.link + "' target='_blank'>" + article.title + "</a></h2>"+
                    "</div>"+
                    "<div class='panel-body'>" +
                        "<button class='btn btn-primary pull-right btn-comment' data-article-id='" + article._id + "'>Comments</button>"+
                    "</div>");
                $("#articles-window").append(newDiv);
            });
        } else if(window.location.pathname === "/dashboard"){
            $("#articles-window").html('');
            articles.reverse().forEach(function(article){
                var newDiv = $('<div>');
                var button = "<button class='btn btn-primary pull-right btn-article' data-article-id='" + article._id + "'>Save Article</button>";;
                article.saved.forEach(function(userRef){
                    if(userRef.id === user){
                        button = "<button class='btn btn-primary pull-right btn-remove' data-article-id='" + article._id + "'>Remove Article</button>";
                    }
                })
                newDiv.addClass("panel panel-default")
                newDiv.html(
                    "<div class='panel-heading'>" +
                        "<h2 class='panel-title'><a href='" + article.link + "' target='_blank'>" + article.title + "</a></h2>"+
                    "</div>"+
                    "<div class='panel-body'>" +
                        button +
                    "</div>");
                $("#articles-window").append(newDiv);
            });
        }
        
    }

    function viewLoader(){
        if(window.location.pathname === "/dashboard"){
            $.get('/api/articles', function(response){
                if(!response){
                    return console.log("Database error")
                }
                articleBuilder(response.articles, response.user);
            });
        } else if(window.location.pathname === "/articles") {

            $.get('/api/savedArticles', function(response){
                if(!response){
                    return console.log("Database error")
                }
                articleBuilder(response, '');
            });
            console.log('you are on the saved page');
        }
    }
    
    function scrapeSubmit(){
        $('#scraper-form').on('submit', function(e){
            e.preventDefault();
            var data = {
                select: $('#selectnews').val()
            }
            $.post('/api/articles', data, function(response){
                viewLoader();
            });
        });
    }

    function submitNote(){
        $("#note-form").on('submit', function(e){
            e.preventDefault();
           
            
        });
    }

    function saveArticles(){
        var articleId = $(this).data();
        var that = $(this);
        $.post('/api/saveArticles/', articleId, function(response) {
            that.text('Remove Article');
            that.removeClass('btn-article');
            that.addClass("btn-remove");
        });
    }

    function removeArticles(){
        var articleId = $(this).data();
        var that = $(this);
        $.post('/api/removeSavedArticles/', articleId, function(response) {
            that.text('Save Article');
            that.removeClass('btn-remove');
            that.addClass("btn-article");
        });
    }

    function showComments(){
        var articleId = $(this).data('article-id');
        $.get('/api/notes/'+ articleId, function(response){
            var content = generateComments(response.article.notes, articleId, response.user);
            var dialog = bootbox.prompt({
                title: "Comments for " + response.article.title + '<div> ' + 
                '<ul class="list-group">' + content + '</ul>' +
            '</div>',
                inputType: 'textarea',
                callback: function(results){
                    if(results && results.length > 0 ){
                        var data = {
                            articleId: articleId,
                            comment: results
                        }
                        $.post('/api/notes/', data, function(response){
                            bootbox.alert({
                                message: "<p>Successfully saved your note.</p>",
                            });
                        });
                    } else {
                        bootbox.alert({
                            message: "<p>Sorry your comment was too short.</p>",
                        });
                    }
                }
            });
            dialog.init();
            dialog.modal('show');
        });
    }

    function deleteComment(){
        var commentId = $(this).data('comment-id');
        var articleId = $(this).data('article-id');
        $.ajax({
            type: 'DELETE',
            url: '/api/notes/' + commentId + "/" + articleId,
            success: function(results){
                window.location.reload();
            }
        })
    }

    function generateComments(comments, articleId, user){
        var html ='';
       
        comments.forEach(function(comment){
            var deleteButton = '';
            if(comment.author.id === user){
                deleteButton = '<button class="btn btn-lg btn-primary btn-delete-comment" data-comment-id="' + comment._id + '" data-article-id="' + articleId + '">Delete</button>';
            }
            html += 
            '<li class="list-group-item">'+
                '<p>' + comment.comment + ' by <em>' + comment.author.username + '</em></p>'+
                deleteButton +
            '</li>'
        });
        return html;
    }

    viewLoader();
    scrapeSubmit();
    submitNote();
});