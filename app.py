from flask import Flask, render_template, request, jsonify
import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'


def extract_text_and_checkboxes(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    text = pytesseract.image_to_string(
        gray, lang="eng", config='--oem 1 --psm 6')
    text = text.strip().lower()
    checkboxes_exist = 'checkbox' in text
    filled_checkboxes = []
    if checkboxes_exist:
        filled_keywords = ['checked', 'ticked', 'filled']
        for keyword in filled_keywords:
            if keyword in text:
                filled_checkboxes.append(keyword)

    return text, checkboxes_exist, filled_checkboxes


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/terms')
def terms():
    return render_template('terms.html')


@app.route('/privacy')
def privacy():
    return render_template('privacy.html')


@app.route('/cookies')
def cookies():
    return render_template('cookies.html')


@app.route('/getting_started')
def getting_started():
    return render_template('getting_started.html')


@app.route('/bug')
def bug():
    return render_template('bug.html')


@app.route('/error')
def error():
    return render_template('error.html')


@app.route('/process_image', methods=['POST'])
def process_image():
    file = request.files['file']
    image_path = 'uploaded_image.jpg'
    file.save(image_path)

    extracted_text, checkboxes_exist, filled_checkboxes = extract_text_and_checkboxes(
        image_path)

    response = {
        'text': extracted_text,
        'checkboxes_exist': checkboxes_exist,
        'filled_checkboxes': filled_checkboxes
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
