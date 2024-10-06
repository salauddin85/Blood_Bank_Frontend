let nextPageUrl = null; 
let previousPageUrl = null;

async function fetchBlogPosts(pageUrl = 'https://blood-bank-backend-c7w8.onrender.com/blood_bank_releted/blog/') {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(pageUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blogData = await response.json();
        nextPageUrl = blogData.next;
        previousPageUrl = blogData.previous;

        displayBlogPosts(blogData.results);
        updatePaginationButtons();
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }
}

function displayBlogPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'col-lg-4 col-md-6 col-sm-12';
        postElement.innerHTML = `
          <div class="blog-card">
            <div class="blog-post">
              <img src="${post.image}" alt="${post.title}" class="img-fluid">
              <div class="p-3 text-center">
                <h3>${post.title}</h3>
                <p>${post.content}</p>
              </div>
            </div>
          </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function updatePaginationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.style.display = previousPageUrl ? 'block' : 'none';
    nextBtn.style.display = nextPageUrl ? 'block' : 'none';
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (previousPageUrl) {
        fetchBlogPosts(previousPageUrl);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (nextPageUrl) {
        fetchBlogPosts(nextPageUrl);
    }
});

fetchBlogPosts();

// Open modal when the button is clicked
document
  .getElementById("openAddBlogModal")
  .addEventListener("click", function () {
    var blogModal = new bootstrap.Modal(
      document.getElementById("addBlogModal")
    );
    blogModal.show();
  });

function submitBlog() {
    const token = localStorage.getItem("authToken");
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    const imageFile = document.getElementById('blogImage').files[0]; // Get the file input

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', imageFile); // Append the image file

    fetch('https://blood-bank-backend-c7w8.onrender.com/blood_bank_releted/blog/', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`
        },
        body: formData // Send the FormData object
    })
    .then(response => {
        if (response.ok) {
            alert('Blog added successfully!');
            document.getElementById('blogForm').reset(); // Reset the form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
            modal.hide(); // Close modal after success
        } else {
            alert('Failed to add blog.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while adding the blog.');
    });
}





// ---------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://blood-bank-backend-c7w8.onrender.com/blood_bank_releted/blog/';
    const blogContainer = document.getElementById('blog-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageLinks = document.querySelectorAll('.page-number');
  
    let currentPage = 1; // Start on the first page
    const blogsPerPage = 4;
  
    // Fetch blogs from API
    function fetchBlogs(page) {
      fetch(`${apiUrl}?page=${page}`)
        .then(response => response.json())
        .then(data => {
          displayBlogs(data.results);
          updatePagination(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  
    // Function to display blogs
    function displayBlogs(blogs) {
      blogContainer.innerHTML = ''; // Clear the container before rendering
      blogs.forEach(blog => {
        console.log(blog.image)
        const blogCard = `
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="blog-cardblock h-100">
              <div class="blog-cardbody text-center">
                <img src="${blog.image}" class="blog-imageimg img-fluid" alt="${blog.title}">
                <div class="blog-textblock mt-3">
                  <h5 class="blog-cardhead">${blog.title}</h5>
                  <p class="blog-contentp">${blog.content}...</p>
                </div>
              </div>
            </div>
          </div>`;
        blogContainer.innerHTML += blogCard;
      });
    }
  
    // Update pagination buttons
    function updatePagination(data) {
      // Handle previous and next button visibility
      prevBtn.style.display = currentPage === 1 ? 'none' : 'inline-block';
      nextBtn.style.display = data.next ? 'inline-block' : 'none';
  
      // Update page numbers
      const totalPages = Math.ceil(data.count / blogsPerPage);
      pageLinks.forEach((link, index) => {
        const pageNum = index + 1;
        if (pageNum <= totalPages) {
          link.innerText = pageNum;
          link.style.display = 'inline-block'; // Show the link
          link.onclick = function() {
            currentPage = pageNum; // Set current page to clicked page
            fetchBlogs(currentPage);
          };
        } else {
          link.style.display = 'none'; // Hide excess page links
        }
      });
    }
  
    // Previous button click event
    prevBtn.addEventListener('click', function(event) {
      event.preventDefault();
      if (currentPage > 1) {
        currentPage--; // Decrease current page
        fetchBlogs(currentPage); // Fetch blogs for the new current page
      }
    });
  
    // Next button click event
    nextBtn.addEventListener('click', function(event) {
      event.preventDefault();
      currentPage++; // Increase current page
      fetchBlogs(currentPage); // Fetch blogs for the new current page
    });
  
    // Initial fetch
    fetchBlogs(currentPage);
  });
  