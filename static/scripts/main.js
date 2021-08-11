$(document).ready( ()=>{
    $(".comment_edit_form").on('submit',edit_comment_handler)
    $(".comment_add_form").on('submit', add_comment_handler)
    $(".delete_comment").on('click', delete_comment_handler)
    $(".react_button").on('click', react_handler)
    $(".search_form").on('submit', search_handler)
    $(".search_bar").on('keyup', search_handler)
    $(".delete_post").on('click', delete_post_handler)
    $(".post_edit_form").on('submit',edit_post_handler)
})

function edit_post_handler(event){
    event.preventDefault();
    let post_id = parseInt($(this).parents('.post').attr('id').match(/[0-9]+/)[0]);
     let data = { 'post_id': post_id,
                 'post_title': $(this).find('#post_title').val(),
                 'post_desc': $(this).find('#post_desc').val()}
    serverRequestControl(this, method='POST', url='/update_post/', id=post_id,
                        data=data, callback= update_post)
}

function delete_post_handler(event){
    let confirmation = confirm("DO YOU WANT TO DELETE THIS POST??")
    if (confirmation){
    let post_id = parseInt($(this).parents('.post').attr('id').match(/[0-9]+/)[0]);
    serverRequestControl(this, method='POST', url='/delete_post/', id=post_id,
                        data={'post_id': post_id}, callback= delete_post)
    }
}

function search_handler(event){
    event.preventDefault();
    if ($(this).hasClass('search_bar')){
        serverRequestControl(this,method='GET',url='/search/',
                              id=0, data={'q': $(this).val()}, callback= search_result)
    }else{
        serverRequestControl(this,method='GET',url='/search/',
                              id=0, data={'q': $(this).find('.form-control').val()}, callback= search_result)
    }
}

function edit_comment_handler(event){
    event.preventDefault();
    let comment_id = parseInt(this.id.match(/[0-9]+/)[0]);
    let data={'comment_id': comment_id ,
         comment_text : $(this).find('.form-control').val(),}
    serverRequestControl(this, method='POST', url='update_comment/', id=comment_id, data=data ,callback=edit_comment);
}

function add_comment_handler(event){
    event.preventDefault();
    let post_id = parseInt(this.id.match(/[0-9]+/)[0]);
    let data={'post_id': post_id ,
         comment_text : $(this).find('.form-control').val(),};
    serverRequestControl(this, method='POST', url='add_comment/', id=post_id, data=data ,callback=add_comment);
}

function delete_comment_handler(event){
    let confirmation = confirm("DO YOU WANT TO DELETE THIS COMMENT?")
    if (confirmation){
    let comment_id = parseInt($(this).parents('.comment').attr('id').match(/[0-9]+/)[0]);
    serverRequestControl(this,method='GET',url='/delete_comment/',
    id=comment_id, data={'comment_id': comment_id}, callback= delete_comment)
    }
}

function react_handler(event){
    let post_id = parseInt($(this).parents('.post').attr('id').match(/[0-9]+/)[0]);
    serverRequestControl(this,method='GET',url='/react/',
                              id=post_id, data={'post_id': post_id}, callback= react)
}

function edit_comment(comment_id, json){
    $(`#comment_${comment_id}_text`).text(json.comment_text);
    $(`#comment_${comment_id}` + ' #hideShow').attr('aria-expanded','false');
    $(`#comment_${comment_id}` + ' .collapse').toggleClass('show');
}

function add_comment(post_id, json){
    $(`#Post${post_id} .list-group`).append(json.html_view);
    console.log(json.html_view)
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
    $('.posts_list').html(response);
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

