// main javascript for webscraper app

// GET request with ajax for the user comments

// $('.show-comments-btn').on('click', function() {
//     alert("button id: " + $(this).attr('data-id'));
// });

$('.show-comments-btn').on('click', function() {

    var btnID = $(this).attr('data-id');
    
    $.ajax({
        method: "GET",
        url: "/article/comment/" + btnID 

    }).then(function(data) {
        console.log(data);
        console.log(data.comment[0].body);
        var commentTag = $("<p>").text(data.comment[0].body);
        $('#comments-div').append(commentTag);
    });
});
