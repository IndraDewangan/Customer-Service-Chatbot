from flask import Flask, render_template, request, jsonify
from flask_cors import cross_origin,CORS
from chat import get_response

app = Flask(__name__)
CORS(app)

@cross_origin()
@app.get("/")
def index_get():
    status = request.args.get('status') # Access the parameter
    email = request.args.get('email')  # Access the parameter
    print(status)
    return render_template("base.html",status=status,email=email)   

@app.post("/predict")
@cross_origin()
def predict():
    text = request.get_json().get("message")
    response = get_response(text)
    message = {"answer": response}
    return jsonify(message)

if __name__=="__main__":
    app.run(debug=True)