"use strict";

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

function getFormattedDatetime(dtstr) {
    let dt = new Date(dtstr);
    return dt.toLocaleString();
}

function sortByCreatedAt(a, b) {
    if (a.created_at < b.created_at) {
        return 1;
    } else if (a.created_at > b.created_at) {
        return -1;
    }
    return 0;
}

function getTopicList(limit) {
    let table = document.getElementById('topic-list');
    topics.sort((a, b) => {
        return sortByCreatedAt(a, b);
    });
    for (let i = 0; i < topics.length; i += 1) {
        if (limit && i >= limit) {
            break;
        }
        let topic = topics[i];
        table.insertAdjacentHTML(
            'beforeend',
            `<tr onclick="document.location = 'topic-detail.html?topicId=${topic.id}';">
                <td>${topic.title}</td>
                <td>${topic.views}</td>
                <td>${topic.replies.length}</td>
                <td>${getFormattedDatetime(topic.created_at)}</td>
            </tr>`
        );
    }
}

function getTopicDetail(topicId) {
    let content = document.getElementById('topic-content');
    let topic = null;
    for (let i = 0; i < topics.length; i += 1) {
        if (topics[i].id == topicId) {
            topic = topics[i];
            break;
        }
    }
    if (!topic) {
        content.insertAdjacentHTML(
            'beforeend',
            `<p class="topic-not-found">
                Such topic is not found. You can ask a question 
                <a href="topic-create.html">here</a> or go and 
                look into <a href="topics.html">other topics</a>.
            </p>`
        );
    } else {
        let replies = topic.replies;
        let repliesHTML = "";
        if (replies.length) {
            replies.sort((a, b) => {
                return sortByCreatedAt(a, b);
            })
            let repliesCountStr = `${replies.length}`;
            if (replies.length === 1) {
                repliesCountStr += ` Answer`;
            } else {
                repliesCountStr += ` Answers`;
            }
            repliesHTML = `<div class="reply-count">${repliesCountStr}</div>`
            repliesHTML += `<ul class="reply-list"><hr/>`;
            for (let i = 0; i < replies.length; i += 1) {
                let reply = replies[i];
                repliesHTML += `
                    <li>
                        <div class="reply-body">${reply.body}</div>
                        &mdash; <div class="reply-author">${reply.author.username}</div>
                        at <div class="reply-created-at">
                            ${getFormattedDatetime(reply.created_at)}
                        </div>
                    </li>
                    <hr/>
                `;
            }
            repliesHTML += `</ul>`;
        } else {
            repliesHTML = `<p class="no-replies">No replies at the moment.</p>`;
        }

        let viewsStr = `${topic.views}`;
        if (topic.views === 1) {
            viewsStr += ` time`;
        } else {
            viewsStr += ` times`
        }

        content.insertAdjacentHTML(
            'beforeend',
            `<div class="topic-wrapper">
            <div class="topic-title">${topic.title}</div>
            <div class="topic-info-row">
                <div class="topic-author">
                    <span class="topic-field-label">Author</span> ${topic.author.username}
                </div>
                <div class="topic-created-at">
                    <span class="topic-field-label">Asked at</span> ${getFormattedDatetime(topic.created_at)}
                </div>
                <div class="topic-views">
                    <span class="topic-field-label">Viewed</span> ${viewsStr}
                </div>
            </div>
            <hr/>
            <div class="topic-body">${topic.body}</div>
            </div>
            <div class="replies-wrapper">
            <div class="topic-replies">${repliesHTML}</div>
            </div>`
        );
    }
    return topic;
}
