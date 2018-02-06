$(document).ready(function() {

    $(document).on('click', '.btn-article', saveArticles);
    
    function articleBuilder(articles){
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
                newDiv.addClass("panel panel-default")
                newDiv.html(
                    "<div class='panel-heading'>" +
                        "<h2 class='panel-title'><a href='" + article.link + "' target='_blank'>" + article.title + "</a></h2>"+
                    "</div>"+
                    "<div class='panel-body'>" +
                        "<button class='btn btn-primary pull-right btn-article' data-article-id='" + article._id + "'>Save Article</button>"+
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
                console.log(response);
                articleBuilder(response);
            });
        } else if(window.location.pathname === "/articles") {

            $.get('/api/savedArticles', function(response){
                if(!response){
                    return console.log("Database error")
                }
                console.log(response);
                articleBuilder(response);
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
            var data = {
                comment: $("#note-comment").val()
            }
            console.log(data);
            $.post('/api/notes/', data, function(response){
                console.log(response);
            });
        });
    }

    function saveArticles(){
        var articleId = $(this).data();
        $.post('/api/saveArticles/', articleId, function(response) {
            $(this).text('Remove Article');
            console.log(response);
        })
    }

    viewLoader();
    scrapeSubmit();
    submitNote();
});