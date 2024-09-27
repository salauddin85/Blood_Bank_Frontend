fetch("footer.html")
  .then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    return res.text();
  })
  .then((data) => {
    // console.log(data)
    document.getElementById("footer").innerHTML = data;
  })
  .catch((error) => {
    console.error('Error loading navbar:', error);
  });
 
