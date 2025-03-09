from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def check_loan_eligibility(data):
    reasons = []
    eligible = True
    loan_amount = 0
    
    # Rule 1
    if data['business_age'] < 6 and not data['has_collateral']:
        reasons.append("Business age less than 6 months and no collateral provided")
        eligible = False
    
    # Rule 2
    if 6 <= data['business_age'] <= 12 and data['revenue'] < 300000:
        reasons.append("Revenue is less than 300,000 Frw for business age 6-12 months")
        eligible = False
    
    # Rule 3
    if (6 <= data['business_age'] <= 12 and 
        data['revenue'] >= 300000 and 
        data['loan_amount'] <= 2 * data['revenue']):
        loan_amount = min(max(300000, data['loan_amount']), 2000000)
    
    # Rule 4
    if (data['business_age'] > 12 and 
        data['revenue'] >= 600000 and 
        data['loan_amount'] <= 3 * data['revenue']):
        loan_amount = min(max(1000000, data['loan_amount']), 5000000)
    
    # Rule 5
    if (data['business_age'] > 12 and 
        data['revenue'] >= 3000000 and 
        data['has_collateral']):
        loan_amount = min(max(5000000, data['loan_amount']), 10000000)
    
    # Rule 6
    if data['has_unpaid_loans'] and data['default_rate'] > 30:
        reasons.append("High default rate on unpaid loans")
        eligible = False
    
    # Rule 7
    if data['credit_score'] >= 700 and data['is_registered']:
        loan_amount = loan_amount * 1.2  # 20% bonus for good credit score and registration
    
    if not loan_amount and eligible:
        reasons.append("Did not qualify for any loan category")
        eligible = False
    
    return {
        "eligible": eligible,
        "loan_amount": loan_amount if eligible else 0,
        "reasons": reasons
    }

@app.route('/check_eligibility', methods=['POST'])
def process_loan_application():
    data = request.json
    result = check_loan_eligibility(data)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=8000, debug=True)
