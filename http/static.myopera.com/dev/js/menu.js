$(document).ready(function() {
    $('#userinfo').hover(function() { $('#userinfo-name').unbind('click'); });
    $('#userinfo-name').focus(function() { $('#userinfo ul').show(); });
    $('#userinfo-name').click(function(e) { $('#userinfo ul').toggle(); e.preventDefault(); });
});
