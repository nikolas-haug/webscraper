// main javascript for webscraper app

// ajax call for the 'scrape' button
$('#scrape-btn').on('click', function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data) {
        $('.scrape-modal').modal('show');
    });
});

// TO DO - fix this so the page refreshes without reload
$('#scrape-modal-dismiss').on('click', function() {
    location.reload();
});
