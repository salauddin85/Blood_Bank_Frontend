function getPaymentFailedQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        paymentStatus: params.get('status'),
        paymentAmount: params.get('amount'),
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const paymentData = getPaymentFailedQueryParams();

    // Check if the payment was successful
    if (paymentData.paymentStatus === 'failed') {
        const transactionDataElement = document.getElementById('transactionData');
        const failMessageElement = document.getElementById('successMessage');

        // Populate the table with transaction details
        transactionDataElement.innerHTML = `
            <tr>
                <td>${paymentData.paymentStatus}</td>
               
                <td>${paymentData.paymentAmount}</td>
            </tr>
        `;

        // Show success message
        failMessageElement.classList.remove('d-none');
    }
});function getPaymentFailedQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        paymentStatus: params.get('status'),
        paymentAmount: params.get('amount'),
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const paymentData = getPaymentFailedQueryParams();

    // Check if the payment failed
    if (paymentData.paymentStatus === 'failed') {
        const transactionDataElement = document.getElementById('transactionData');
        const failMessageElement = document.getElementById('failMessage');

        // Populate the table with transaction details
        transactionDataElement.innerHTML = `
            <tr>
                <td>${paymentData.paymentStatus}</td>
                <td>${paymentData.paymentAmount}</td>
            </tr>
        `;

        // Show failure message
        failMessageElement.classList.remove('d-none');
    }
});

