document.getElementById('loanForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        business_owner: document.getElementById('businessOwner').value,
        business_age: parseInt(document.getElementById('businessAge').value),
        revenue: parseInt(document.getElementById('revenue').value),
        loan_amount: parseInt(document.getElementById('loanAmount').value),
        has_collateral: document.getElementById('hasCollateral').value === 'true',
        credit_score: parseInt(document.getElementById('creditScore').value),
        has_unpaid_loans: document.getElementById('hasUnpaidLoans').value === 'true',
        default_rate: parseInt(document.getElementById('defaultRate').value),
        is_registered: document.getElementById('isRegistered').value === 'true'
    };

    try {
        const response = await fetch('http://localhost:8000/check_eligibility', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        const commonParams = new URLSearchParams({
            name: formData.business_owner,
            businessAge: formData.business_age,
            revenue: formData.revenue,
            hasCollateral: formData.has_collateral,
            creditScore: formData.credit_score,
            hasUnpaidLoans: formData.has_unpaid_loans,
            defaultRate: formData.default_rate,
            isRegistered: formData.is_registered
        });
        
        if (result.eligible) {
            window.location.href = `success.html?${commonParams}&amount=${encodeURIComponent(result.loan_amount)}`;
        } else {
            window.location.href = `failure.html?${commonParams}&reasons=${encodeURIComponent(result.reasons.join(','))}`;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
});
