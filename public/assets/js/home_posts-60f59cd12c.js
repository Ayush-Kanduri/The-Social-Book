{let t=()=>{let t=$("#new-post-form");t.submit((s=>{s.preventDefault();const o=new FormData(t[0]);$.ajax({type:"POST",url:"/posts/create",enctype:"multipart/form-data",processData:!1,contentType:!1,cache:!1,data:o,success:s=>{let o=e(s.data.post,s.data.user);$("#posts-list-container>ul").prepend(o),new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Post Published !!!",type:"success",layout:"topRight",timeout:3e3}).show(),t.trigger("reset"),n($(" .delete-post-button",o)),new PostComments(s.data.post._id)},error:t=>{console.log("error",t),new Noty({theme:"metroui",text:`${t.responseJSON.error}`,type:"error",layout:"topRight",timeout:3e3}).show()}})}))},e=(t,e)=>{let n,s,o,a,l,i=[];try{let r="images/empty-avatar.png",c=`this.onerror=null; this.src="<%= assetPath('${r}') %>"`;a=e.avatar?`<img\n\t\t\t\t\t\t\tclass="user-avatar create-post-avatar"\n\t\t\t\t\t\t\tsrc="${e.avatar}"\n\t\t\t\t\t\t\talt="${e.name}"\n\t\t\t\t\t\t\tonclick="window.location.href='/users/profile/${e._id}'"\n\t\t\t\t\t\t\tonerror="${c}"\n\t\t\t\t\t\t\tloading="lazy"\n\t\t\t\t\t\t/>`:`<img\n\t\t\t\t\t\t\tclass="user-avatar create-post-avatar"\n\t\t\t\t\t\t\tsrc="<%= assetPath('${r}') %>"\n\t\t\t\t\t\t\talt="${e.name}"\n\t\t\t\t\t\t\tonclick="window.location.href='/users/profile/${e._id}'"\n\t\t\t\t\t\t\tonerror="${c}"\n\t\t\t\t\t\t\tloading="lazy"\n\t\t\t\t\t\t/>`,n=""!==t.contentImage?`<img\n\t\t\t\t\t\t\tsrc="${t.contentImage}"\n\t\t\t\t\t\t\talt="alt-post-image"\n\t\t\t\t\t\t\tloading="lazy"\n\t\t\t\t\t\t/>`:"",s=""!==t.contentVideo?`<video src="${t.contentVideo}" alt="alt-post-video" controls />`:"",o=t.user.avatar?`<img\n\t\t\t\t\t\t\t\tclass="user-avatar"\n\t\t\t\t\t\t\t\tsrc="${t.user.avatar}"\n\t\t\t\t\t\t\t\talt="${t.user.name}"\n\t\t\t\t\t\t\t\tonclick="window.location.href='/users/profile/${t.user._id}'"\n\t\t\t\t\t\t\t\tloading="lazy"\n\t\t\t\t\t\t\t/>`:`<img\n\t\t\t\t\t\t\t\tclass="user-avatar"\n\t\t\t\t\t\t\t\tsrc="<%= assetPath('${r}') %>"\n\t\t\t\t\t\t\t\talt="${t.user.name}"\n\t\t\t\t\t\t\t\tonclick="window.location.href='/users/profile/${t.user._id}'"\n\t\t\t\t\t\t\t\tloading="lazy"\n\t\t\t\t\t\t\t/>`,i=t.likes.filter((e=>e.user._id.toString()===locals.user._id.toString()&&"Post"===e.onModel&&t._id.toString()===e.likeable._id.toString())),l=i.length>0?`<a href="/likes/toggle/?id=${t._id}&type=Post" \n\t\t\t\tclass="like toggle-like-button" \n\t\t\t\tdata-likes="0" \n\t\t\t\tstyle="color: rgb(199, 0, 0);">\n\t\t\t\t\t<i class="fa-solid fa-thumbs-up"></i>\n\t\t\t\t\t&ensp;<span>0 Like</span>\n\t\t\t\t</a>`:`<a href="/likes/toggle/?id=${t._id}&type=Post" \n\t\t\t\tclass="like toggle-like-button" \n\t\t\t\tdata-likes="0" \n\t\t\t\tstyle="color: #00547a;">\n\t\t\t\t\t<i class="fa-solid fa-thumbs-up"></i>\n\t\t\t\t\t&ensp;<span>0 Like</span>\n\t\t\t\t</a>`}catch(t){console.log("error",t)}return $(`<li id="post-${t._id}" class="card post-li">\n\t<div class="post">\n\t\t<div class="post-heading">\n\t\t\t${o}\n\t\t\t<p class="post-info">\n\t\t\t\t<small\n\t\t\t\t\tonclick="window.location.href='/users/profile/${t.user._id}'"\n\t\t\t\t\t>${t.user.name}</small\n\t\t\t\t>\n\t\t\t\t<small>${printPostDate(t.updatedAt)}</small>\n\t\t\t</p>\n\n\t\t\t\x3c!-- We are the one creating the post, so we don't need if else for the user --\x3e\n\t\t\t<small>\n\t\t\t\t\x3c!-- post.id is String by MongoDB, post._id is Number --\x3e\n\t\t\t\t<a class="delete-post-button" href="/posts/delete/${t._id}"\n\t\t\t\t\t><i class="fa-solid fa-trash"></i\n\t\t\t\t></a>\n\t\t\t</small>\n\t\t</div>\n\t\t<div class="post-content">\n\t\t\t<p>${t.content}</p>\n\t\t\t${n}\n\t\t\t${s}\n\t\t</div>\n\t\t<div class="post-react">\n\t\t\t${l}\n\t\t\t<a href="" class="comment" onclick="event.preventDefault();"\n\t\t\t\t><i class="fa-solid fa-message"></i>&ensp;Comment</a\n\t\t\t>\n\t\t\t<a href="#/" class="share"\n\t\t\t\t><i class="fa-solid fa-share"></i>&ensp;Share</a\n\t\t\t>\n\t\t</div>\n\t</div>\n\t<div class="post-comments">\n\t\t\x3c!-- We are already signed in, so we are only creating the post --\x3e\n\t\t<form\n\t\t\taction="/comments/create"\n\t\t\tid="post-${t._id}-comments-form"\n\t\t\tmethod="post"\n\t\t>\n\t\t\t${a}\n\t\t\t<textarea\n\t\t\t\tname="content"\n\t\t\t\tcols="30"\n\t\t\t\trows="3"\n\t\t\t\tplaceholder="Type Here To Add Comment ..."\n\t\t\t\trequired\n\t\t\t></textarea>\n\t\t\t\x3c!-- Send ID of this specific Post where the Comment would be added  --\x3e\n\t\t\t<input type="hidden" name="post" value="${t._id}" />\n\t\t\t<input class="btn-grad" type="submit" value="Add Comment" />\n\t\t</form>\n\t\t<div class="post-comments-list">\n\t\t\t<ul id="post-comments-${t._id}" class="post-comments-ul">\n\t\t\t\t\x3c!-- We will append the comment when we need to --\x3e\n\t\t\t</ul>\n\t\t</div>\n\t</div>\n</li>\n`)};function printPostDate(t){let e=t;e=new Date(e);const n=e.getDate(),s=e.getFullYear();return n+" "+e.toLocaleString("default",{month:"short"})+", "+s+" | "+e.toLocaleTimeString("default",{hour:"2-digit",minute:"2-digit"})}let n=t=>{$(t).click((e=>{e.preventDefault(),$.ajax({type:"GET",url:$(t).prop("href"),success:t=>{$(`#post-${t.data.post_id}`).remove(),new Noty({theme:"relax",text:"Post Deleted !!!",type:"success",layout:"topRight",timeout:3e3}).show()},error:t=>{console.log("Error: ",t.responseText)}})}))},s=function(){$("#posts-list-container>ul>li").each((function(){let t=$(this),e=$(" .delete-post-button",t);n(e);let s=t.prop("id").split("-")[1];new PostComments(s)}))},o=()=>{$(".share").click((t=>{t.preventDefault()}))};t(),s(),o()}