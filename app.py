import os
import sys
import subprocess
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__)

# إعدادات القاعدة البيانات
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)

# ============================================================
# DATABASE MODELS
# ============================================================
class Arrivee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    expediteur = db.Column(db.String(150), nullable=False)
    sujet = db.Column(db.String(255), nullable=False)
    division = db.Column(db.String(150), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

class Depart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destinataire = db.Column(db.String(150), nullable=False)
    sujet = db.Column(db.String(255), nullable=False)
    division = db.Column(db.String(150), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

# ============================================================
# ROUTES
# ============================================================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# --- المراسلات الواردة ---
@app.route('/arrivee')
def arrivee():
    courriers = Arrivee.query.order_by(Arrivee.id.desc()).all()
    return render_template('arrivee.html', courriers=courriers)

@app.route('/add_arrivee', methods=['POST'])
def add_arrivee():
    file = request.files.get('file')
    filename = secure_filename(file.filename) if file else None
    if file: file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    new_courrier = Arrivee(
        expediteur=request.form.get('expediteur'), 
        sujet=request.form.get('sujet'), 
        division=request.form.get('division'), 
        notes=request.form.get('notes'),
        file_path=filename
    )
    db.session.add(new_courrier)
    db.session.commit()
    return redirect(url_for('arrivee'))

@app.route('/delete_arrivee/<int:id>', methods=['POST'])
def delete_arrivee(id):
    courrier = Arrivee.query.get_or_404(id)
    db.session.delete(courrier)
    db.session.commit()
    return jsonify({"status": "success"})

# --- المراسلات الصادرة ---
@app.route('/depart')
def depart():
    courriers = Depart.query.order_by(Depart.id.desc()).all()
    return render_template('depart.html', courriers=courriers)

@app.route('/add_depart', methods=['POST'])
def add_depart():
    file = request.files.get('file')
    filename = secure_filename(file.filename) if file else None
    if file: file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    new_courrier = Depart(
        destinataire=request.form.get('destinataire'), 
        sujet=request.form.get('sujet'), 
        division=request.form.get('division'), 
        notes=request.form.get('notes'),
        file_path=filename
    )
    db.session.add(new_courrier)
    db.session.commit()
    return redirect(url_for('depart'))

@app.route('/delete_depart/<int:id>', methods=['POST'])
def delete_depart(id):
    courrier = Depart.query.get_or_404(id)
    db.session.delete(courrier)
    db.session.commit()
    return jsonify({"status": "success"})

# --- الأرشيف ---
@app.route('/archive')
def archive():
    # هنا كنجيبو كاع البيانات للأرشيف
    arrivee_results = Arrivee.query.all()
    depart_results = Depart.query.all()
    return render_template('archive.html', arrivee_results=arrivee_results, depart_results=depart_results)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# تهيئة قاعدة البيانات وتشغيل التطبيق
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)