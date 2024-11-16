function getPaymentSuccessQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        paymentStatus: params.get('status'),
        transactionId: params.get('transaction_id'),
        paymentAmount: params.get('amount'),
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const paymentData = getPaymentSuccessQueryParams();

    // Check if the payment was successful
    if (paymentData.paymentStatus === 'success') {
        const transactionDataElement = document.getElementById('transactionData');
        const successMessageElement = document.getElementById('successMessage');

        // Populate the table with transaction details
        transactionDataElement.innerHTML = `
            <tr>
                <td>${paymentData.paymentStatus}</td>
                <td>${paymentData.transactionId}</td>
                <td>${paymentData.paymentAmount}</td>
            </tr>
        `;

        // Show success message
        successMessageElement.classList.remove('d-none');
    }
});
