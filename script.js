$(document).ready(function() {
    const loader = $('#loader');
    const themeToggle = $('#theme-toggle');
    let users = [];
    let favorites = [];
    let usersTable;
    let favoritesTable;
    let posts = [];

    function showLoader() {
        loader.show();
    }

    function hideLoader() {
        loader.hide();
    }

    function refreshTables() {
        if (usersTable) {
            usersTable.clear().rows.add(users).draw();
        }
        if (favoritesTable) {
            const favoriteUsers = users.filter(u => favorites.includes(u.id));
            favoritesTable.clear().rows.add(favoriteUsers).draw();
        }
    }

    themeToggle.on('click', () => {
        $('body').toggleClass('dark-mode');
        
        if ($('body').hasClass('dark-mode')) {
            themeToggle.html('<i class="fas fa-sun"></i> <span>Light Mode</span>'); 
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.html('<i class="fas fa-moon"></i> <span>Dark Mode</span>'); 
            localStorage.setItem('theme', 'light');
        }
    });

    if (localStorage.getItem('theme') === 'dark') {
        $('body').addClass('dark-mode');
        themeToggle.html('<i class="fas fa-sun"></i> <span>Light Mode</span>');
    }

    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        showLoader();

        Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json()),
            fetch('https://jsonplaceholder.typicode.com/posts').then(res => res.json()),
            fetch('https://jsonplaceholder.typicode.com/comments').then(res => res.json())
        ]).then(([fetchedUsers, fetchedPosts, comments]) => {
            users = fetchedUsers;
            posts = fetchedPosts;
            favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            
            $('#users-count').text(users.length);
            $('#posts-count').text(posts.length);
            $('#comments-count').text(comments.length);

            const tableColumns = [
                { data: 'id' },
                { data: 'name' },
                { data: 'email' },
                { data: 'phone' },
                {
                    data: null, 
                    render: function (data, type, row) {
                        const isFavorited = favorites.includes(row.id) ? 'favorited' : '';
                        return `
                            <button class="view-user icon-button" data-id="${row.id}" title="View"><i class="fas fa-eye"></i></button>
                            <button class="edit-user icon-button" data-id="${row.id}" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                            <button class="delete-user icon-button" data-id="${row.id}" title="Delete"><i class="fas fa-trash"></i></button>
                            <button class="favorite-user icon-button ${isFavorited}" data-id="${row.id}" title="Favorite"><i class="fas fa-star"></i></button>
                        `;
                    }
                }
            ];

            usersTable = $('#users-table').DataTable({
                data: users, 
                pageLength: 5, 
                columns: tableColumns
            });

            const favoriteUsers = users.filter(u => favorites.includes(u.id));
            favoritesTable = $('#favorites-table').DataTable({
                data: favoriteUsers, 
                pageLength: 5, 
                columns: tableColumns
            });

            hideLoader(); 
        }).catch(error => {
            toastr.error("Failed to load dashboard data.");
            hideLoader();
        });
    }

    // Posts Page
    if (window.location.pathname.endsWith('posts.html')) {
        showLoader();

        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => response.json())
            .then(fetchedPosts => {
                posts = fetchedPosts;
                renderPosts();
                hideLoader();
            }).catch(error => {
                toastr.error("Failed to load posts.");
                hideLoader();
            });

        function renderPosts() {
            const postsContainer = $('#posts-container');
            postsContainer.empty();
            posts.forEach(post => {
                postsContainer.append(`
                    <div class="post" data-id="${post.id}">
                        <h3>${post.title}</h3>
                        <p>${post.body.substring(0, 100)}...</p>
                        <div class="post-actions">
                            <button class="view-comments icon-button" data-id="${post.id}"><i class="fas fa-comments"></i></button>
                            <button class="edit-post icon-button" data-id="${post.id}"><i class="fas fa-pencil-alt"></i></button>
                            <button class="delete-post icon-button" data-id="${post.id}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `);
            });
        }
        
        $('#search-posts').on('keyup', function() {
            const searchTerm = $(this).val().toLowerCase();
            $('.post').each(function() {
                const postText = $(this).text().toLowerCase();
                $(this).toggle(postText.indexOf(searchTerm) > -1);
            });
        });
    }


    $(document).on('click', '.modal .close-button', function() {
        $(this).closest('.modal').hide();
    });

    $(document).on('click', '.view-user', function () {
        const userId = $(this).data('id');
        toastr.info(`Viewing details for user ID: ${userId}`);
    });

    $(document).on('click', '.edit-user', function () {
        const userId = $(this).data('id');
        const user = users.find(u => u.id === userId);
        if (user) {
            $('#edit-id').val(user.id);
            $('#edit-name').val(user.name);
            $('#edit-email').val(user.email);
            $('#edit-phone').val(user.phone);
            $('#edit-user-modal').show();
        }
    });

    $(document).on('click', '.delete-user', function () {
        const userId = $(this).data('id');
        users = users.filter(u => u.id !== userId);
        if (favorites.includes(userId)) {
            favorites = favorites.filter(id => id !== userId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
        refreshTables();
        $('#users-count').text(users.length);
        toastr.error(`Deleted user ID: ${userId}`);
    });

    $(document).on('click', '.favorite-user', function () {
        const userId = $(this).data('id');
        favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        if (favorites.includes(userId)) {
            favorites = favorites.filter(id => id !== userId);
            toastr.info(`User ${userId} removed from favorites`);
        } else {
            favorites.push(userId);
            toastr.success(`User ${userId} added to favorites!`);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        refreshTables();
    });

    $('#add-user').on('click', function() {
        $('#add-user-modal').show();
    });

    $('#add-user-form').on('submit', function(e) {
        e.preventDefault();
        const newUser = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
        };

        showLoader();
        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then(response => response.json())
        .then(data => {
            newUser.id = data.id;
            users.push(newUser);
            refreshTables();
            $('#users-count').text(users.length);
            $('#add-user-modal').hide();
            this.reset();
            toastr.success('User added successfully!');
            hideLoader();
        });
    });

    $('#edit-user-form').on('submit', function(e) {
        e.preventDefault();
        const userId = parseInt($('#edit-id').val());
        const updatedUser = {
            id: userId,
            name: $('#edit-name').val(),
            email: $('#edit-email').val(),
            phone: $('#edit-phone').val()
        };

        showLoader();
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedUser),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then(response => response.json())
        .then(data => {
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) users[userIndex] = updatedUser;
            refreshTables();
            $('#edit-user-modal').hide();
            this.reset();
            toastr.success('User updated successfully!');
            hideLoader();
        });
    });

    $('#add-post').on('click', function() {
        $('#add-post-modal').show();
    });

    $('#add-post-form').on('submit', function(e) {
        e.preventDefault();
        const newPost = {
            title: $('#post-title').val(),
            body: $('#post-body').val(),
            userId: 1 
        };

        showLoader();
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then(response => response.json())
        .then(data => {
            posts.unshift(data);
             $('#posts-container').prepend(`
                <div class="post" data-id="${data.id}">
                    <h3>${data.title}</h3>
                    <p>${data.body.substring(0, 100)}...</p>
                    <div class="post-actions">
                        <button class="view-comments icon-button" data-id="${data.id}"><i class="fas fa-comments"></i></button>
                        <button class="edit-post icon-button" data-id="${data.id}"><i class="fas fa-pencil-alt"></i></button>
                        <button class="delete-post icon-button" data-id="${data.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `);
            $('#add-post-modal').hide();
            this.reset();
            toastr.success('Post added successfully!');
            hideLoader();
        });
    });

    $(document).on('click', '.edit-post', function() {
        const postId = $(this).data('id');
        const post = posts.find(p => p.id === postId);
        if (post) {
            $('#edit-post-id').val(post.id);
            $('#edit-post-title').val(post.title);
            $('#edit-post-body').val(post.body);
            $('#edit-post-modal').show();
        }
    });

    $('#edit-post-form').on('submit', function(e) {
        e.preventDefault();
        const postId = parseInt($('#edit-post-id').val());
        const updatedPost = {
            id: postId,
            title: $('#edit-post-title').val(),
            body: $('#edit-post-body').val(),
            userId: 1 
        };

        showLoader();
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then(response => response.json())
        .then(data => {
            const postIndex = posts.findIndex(p => p.id === postId);
            if (postIndex !== -1) posts[postIndex] = data;
            
            const postElement = $(`.post[data-id="${postId}"]`);
            postElement.find('h3').text(data.title);
            postElement.find('p').text(data.body.substring(0, 100) + '...');

            $('#edit-post-modal').hide();
            this.reset();
            toastr.success('Post updated successfully!');
            hideLoader();
        });
    });

    $(document).on('click', '.delete-post', function() {
        const postId = $(this).data('id');
        showLoader();
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE',
        })
        .then(() => {
            posts = posts.filter(p => p.id !== postId);
            $(`.post[data-id="${postId}"]`).remove();
            toastr.error('Post deleted!');
            hideLoader();
        });
    });

    $(document).on('click', '.view-comments', function() {
        const postId = $(this).data('id');
        showLoader();
        
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(res => res.json())
            .then(comments => {
                const commentsList = $('#comments-list');
                commentsList.empty(); 
                comments.forEach(comment => {
                    commentsList.append(`
                        <div class="comment" data-id="${comment.id}">
                            <p><b>${comment.name} (${comment.email}):</b><br>${comment.body}</p>
                            <button class="delete-comment icon-button" data-id="${comment.id}"><i class="fas fa-trash"></i> Delete</button>
                            <hr>
                        </div>
                    `);
                });
                $('#comments-modal').show(); 
                hideLoader();
            });
    });

    $(document).on('click', '.delete-comment', function() {
        const commentId = $(this).data('id');
        showLoader();
        fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
            method: 'DELETE',
        })
        .then(() => {
            $(`.comment[data-id="${commentId}"]`).remove();
            toastr.error('Comment deleted!');
            hideLoader();
        });
    });
});