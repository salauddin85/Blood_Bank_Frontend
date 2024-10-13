
// Open modal when the button is clicked
document
  .getElementById("openAddBlogModal")
  .addEventListener("click", function () {
    var blogModal = new bootstrap.Modal(
      document.getElementById("addBlogModal")
    );
    blogModal.show();
  });



// -------------------------------------------------------------------------------------

  const uploadPreset = 'image_upload_cildank'; // তোমার তৈরি করা upload preset এর নাম

  const submitBlog = async (event) => {
      event.preventDefault(); // Form default submit prevent
      
      const content = document.getElementById("content").value;
      const title = document.getElementById("title").value;
      const wordCountcontent = content.trim().split(/\s+/).filter(word => word.length > 0).length;
      const wordCounttitle = title.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCounttitle>10){
        alert("You cannot add title more than 10 words.");
          return;
      }
      else if (wordCountcontent > 32) {
        alert("You cannot add content more than 32 words.");
        return;
      }

      const imageInput = document.getElementById("image");
      const imageFile = imageInput.files[0]; // Get the selected file
      console.log(imageFile); // Check if the file is correct
  
      if (!imageFile) {
          alert("Please select an image file.");
          return;
      }
  
      // Cloudinary এ ইমেজ আপলোড
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', imageFile); // Add file
      cloudinaryFormData.append('upload_preset', uploadPreset); // Add upload_preset
  
      try {
          const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/dnzqmx8nw/image/upload`, {
              method: "POST",
              body: cloudinaryFormData,
          });
  
          const cloudinaryData = await cloudinaryResponse.json();
          console.log(cloudinaryData,"cloudinary data ")
  
          if (cloudinaryResponse.ok) {
              // ইমেজ URL পাওয়া
              const imageUrl = cloudinaryData.secure_url;
              console.log(imageUrl)
  
              const formData = new FormData(document.getElementById("blogForm"));
              const data = {
                  title: formData.get("title"),   // সঠিক ফিল্ড নাম ব্যবহার করা
                  image: imageUrl,
                  content: formData.get("content"), // সঠিক ফিল্ড নাম ব্যবহার করা
                 
              };
              console.log(data,"data blog")
              const token = localStorage.getItem("authToken");
              console.log(token);
              if (!token) {
                  alert("You are not an authenticated user. Please Login");
                  return;
              }
  
              // fetch API call
              const response = await fetch('https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/blog/', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Token ${token}`,  // Token header
                  },
                  body: JSON.stringify(data),  // FormData কে body হিসেবে পাঠানো
              });
  
              if (response.ok) {
                  alert('Blog added successfully!');
                  document.getElementById('blogForm').reset(); // Form reset
                  const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
                  modal.hide(); // Close modal after success
              } else {
                  const errorData = await response.json();
                  console.error('Failed to add blog:', errorData);
                  alert('Failed to add blog.');
              }
          } else {
              alert("Image upload failed: " + cloudinaryData.error.message); // Show error if image upload fails
          }
      } 
      catch (error) {
          console.error('Error:', error);
          alert('Error occurred while adding the blog.');
      }
  };
  




// ---------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/blog/';
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
        // image/upload/https://res.cloudinary.com/dnzqmx8nw/image/upload/v1728733528/l6hju40fmxwiavhjpm53.jpg
        const img_url = blog.image.replace("image/upload/", "");
        console.log(img_url)
        console.log(blog)
        console.log(blog.image,"adslfalk")
        const blogCard = `
          <div class="col-lg-3 col-md-6 col-sm-12 mb-4">
            <div class="blog-cardblock h-100">
              <div class="blog-cardbody text-center">
                <img src="${img_url}" class="blog-imageimg img-fluid" alt="${blog.title}">
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
  


