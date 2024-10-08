
// Open modal when the button is clicked
document
  .getElementById("openAddBlogModal")
  .addEventListener("click", function () {
    var blogModal = new bootstrap.Modal(
      document.getElementById("addBlogModal")
    );
    blogModal.show();
  });

  const submitBlog = (event) => {
    event.preventDefault(); // Form default submit prevent
    const blogForm = document.getElementById("blogForm");

    const token = localStorage.getItem("authToken"); // Token niye asha
    const formData = new FormData(blogForm); // Form data niye asha (title, content, image)
    console.log(formData)
    console.log(token)
    if (!token) {
      alert("You are not an authenticated user.Please Login");
  
      return;
    }
  
    // fetch API call
    fetch('https://blood-bank-backend-c7w8.onrender.com/blood_bank_releted/blog/', {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,  // Token header
        },
        body: formData  // FormData ke body hisebe pathano
    })
    .then(response => {
        console.log(response);
        if (response.ok) {
            alert('Blog added successfully!');
            document.getElementById('blogForm').reset(); // Form reset
            const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
            modal.hide(); // Close modal after success
        } else {
            return response.json().then(data => {
                console.error('Failed to add blog:', data);
                alert('Failed to add blog.');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while adding the blog.');
    });
};





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
          console.log(data)
          displayBlogs(data.results);
          updatePagination(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  
    // Function to display blogs
    function displayBlogs(blogs) {
      blogContainer.innerHTML = ''; // Clear the container before rendering
      blogs.forEach(blog => {
        console.log(blog.image,"adslfalk")
        const blogCard = `
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="blog-cardblock h-100">
              <div class="blog-cardbody text-center">
                <img src="${blog.image}" class="blog-imageimg img-fluid" alt="${blog.title}">
                <div class="blog-textblock mt-3">
                  <h5 class="blog-cardhead">Author:${blog.author}</h5>

                  <h5 class="blog-cardhead">${blog.title}</h5>
                  <p class="blog-contentp">${blog.content}</p>
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
  




// const imageUploadimbb=(image)=>{

// }

//   // try image upload
//   document.getElementById('image-upload-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent form from submitting the traditional way
  
//     const imageInput = document.getElementById('imageInput').files[0];
//     const formData = new FormData();
//     const apiKey = 'ca0a7f8e97446e4139d17010b039c2da'; // ImageBB theke API key niye ekhane bosan
//     formData.append('image', imageInput);
  
//     // Fetch request to upload image
//     fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
//       method: 'POST',
//       body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         const imageUrl = data.data.url; // Uploaded image URL
//         displayImage(imageUrl); // Show the image on the page
//       } else {
//         console.error('Image upload failed:', data.error);
//       }
//     })
//     .catch(error => {
//       console.error('Error uploading image:', error);
//     });
//   });
  
//   // Function to display the uploaded image
//   function displayImage(url) {
//     const uploadedImageDiv = document.getElementById('uploaded-image');
//     uploadedImageDiv.innerHTML = `<img src="${url}" alt="Uploaded Image" class="img-fluid">`;
//   }
  