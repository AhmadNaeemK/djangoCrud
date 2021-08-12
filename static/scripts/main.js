function edit_comment(comment_id, json){
    $(`#comment_${comment_id}_text`).text(json.comment_text);
    $(`#comment_${comment_id}` + ' #hideShow').attr('aria-expanded','false');
    $(`#comment_${comment_id}` + ' .collapse').toggleClass('show');
}

function add_comment(post_id, json){
    $(`#Post${post_id} .list-group`).append(json.html_view);
    $(`#comment_${json.comment_id} .delete_comment`).on('click', delete_comment_handler)
    $(`#comment_${json.comment_id} .comment_edit_form`).on('submit', edit_comment_handler)
}

function delete_comment(comment_id,response){
    $(`#comment_${comment_id}`).remove();
}

function react(post_id, json){
    $(`#Post${post_id} .num_reacts`).text(json.reacts)
}

function search_result (id=0, response){
    $('.top_container').html(response);
    $(".comment_edit_form").on('submit',edit_comment_handler)
    $(".comment_add_form").on('submit', add_comment_handler)
    $(".delete_comment").on('click', delete_comment_handler)
    $(".react_button").on('click', react_handler)
}

function delete_post(id, response){
    $(`#Post${id}`).remove()
}

function update_post(id, json){
    $(`#Post${id} #title`).text(json.post_title);
    $(`#Post${id} #description`).text(json.post_desc);
    $(`#Post${id}` + ' #hideShow').attr('aria-expanded','false');
    $(`#Post${id}` + ' .collapse').toggleClass('show');
}

function serverRequestControl(element, method, url, id, data ,callback){
    if (method=='POST'){
        const csrftoken = {'csrfmiddlewaretoken': Cookies.get('csrftoken')};
        data = Object.assign({}, csrftoken, data);
    }
    $.ajax({
        url : url,
        type : method,
        data : data,
        success: function(response){
            if (method=='POST'){
                $(element).find('.form-control').val('');
                };
            callback(id,response);
        },
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}



