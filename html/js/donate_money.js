
// Handle Cart for Purchase
const handleTransferMoney = (event) => {
    event.preventDefault();
  
    const recipientName = document.getElementById("recipientName").value;
    const addressLine1 = document.getElementById("addressLine1").value;
    const addressLine2 = document.getElementById("addressLine2").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postalCode").value;
    const country = document.getElementById("country").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const donateamount = document.getElementById("amount").value;
    const numericAmount = parseFloat(donateamount); // এটি আবার সংখ্যায় রূপান্তর করছে
    console.log(numericAmount)
    const token = localStorage.getItem("authToken");
    if(numericAmount<50){
        alert("You cannot donation less than 50 taka")
    }
    if (!token) {
      //   alert("No authentication token found. Please log in.");
        window.location.href = "./login.html";
        return;
    }
  
    fetch("https://blood-bank-deploy-vercel.vercel.app/blood_bank_releted/payment/initiate/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({
            amount:numericAmount,
            address: {
                recipient_name: recipientName,
                phoneNumber:phoneNumber,
                address_line_1: addressLine1,
                address_line_2: addressLine2,
                city: city,
                postal_code: postalCode,
                country: country,
                
            }
            
        }),
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            return res.json().then(data => {
                alert(`Error: ${data.message || 'Unknown error'}`);
                throw new Error(data.message || 'Unknown error');
            });
        }
    })
    .then(data => {
        if (data.status === 'success') {
            window.location.href = data.redirect_url; // Payment Gateway e redirect
        } else {
            alert(`Payment initiation failed: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    });
  };
  
  