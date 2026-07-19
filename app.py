import subprocess
import sys

# ============================================================
# AUTOMATIC PIP INSTALLER (تثبيت المكتبات تلقائياً عند التشغيل)
# ============================================================
try:
    import flask
    import flask_sqlalchemy
except ImportError:
    print("⏳ جاري تثبيت Flask و Flask-SQLAlchemy تلقائياً... انتظر لحظة...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-sqlalchemy"])
    print("✅ تم التثبيت بنجاح! جاري تشغيل السيرفر الآن...")

# ============================================================
# MAIN FLASK APPLICATION (كود السيرفر الرئيسي)
# ============================================================
import os
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__)

# إعدادات السيرفر وقاعدة البيانات ومجلد الملفات
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')

# إنشاء مجلد الـ uploads تلقائياً إذا كان غير موجود
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

db = SQLAlchemy(app)


# ============================================================
# DATABASE MODELS (جداول قاعدة البيانات)
# ============================================================

# جدول المراسلات الواردة
class Arrivee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    expediteur = db.Column(db.String(150), nullable=False)
    sujet = db.Column(db.String(255), nullable=False)
    division = db.Column(db.String(150), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

# جدول المراسلات الصادرة
class Depart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destinataire = db.Column(db.String(150), nullable=False)
    sujet = db.Column(db.String(255), nullable=False)
    division = db.Column(db.String(150), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())


# ============================================================
# ROUTES & PAGES (المسارات والتحكم ف الصفحات)
# ============================================================

# 1. صفحة تسجيل الدخول (الرئيسية)
@app.route('/')
def index():
    return render_template('index.html')

# 2. لوحة التحكم (Dashboard)
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# 3. صفحة المراسلات الواردة (عرض الجدول)
@app.route('/arrivee')
def arrivee():
    courriers = Arrivee.query.order_by(Arrivee.id.desc()).all()
    return render_template('arrivee.html', courriers=courriers)

# 4. استقبال وحفظ مراسلة واردة جديدة ف الـ DB
@app.route('/add_arrivee', methods=['POST'])
def add_arrivee():
    expediteur = request.form.get('expediteur')
    sujet = request.form.get('sujet')
    division = request.form.get('division')
    notes = request.form.get('notes')
    
    file = request.files.get('file')
    filename = None
    if file and file.filename != '':
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    new_courrier = Arrivee(
        expediteur=expediteur, 
        sujet=sujet, 
        division=division, 
        notes=notes,
        file_path=filename
    )
    db.session.add(new_courrier)
    db.session.commit()
    return jsonify({"status": "success", "message": "تم تسجيل المراسلة الواردة بنجاح!"})

# 5. صفحة المراسلات الصادرة (عرض الجدول)
@app.route('/depart')
def depart():
    courriers = Depart.query.order_by(Depart.id.desc()).all()
    return render_template('depart.html', courriers=courriers)

# 6. استقبال وحفظ مراسلة صادرة جديدة ف الـ DB
@app.route('/add_depart', methods=['POST'])
def add_depart():
    destinataire = request.form.get('destinataire')
    sujet = request.form.get('sujet')
    division = request.form.get('division')
    notes = request.form.get('notes')
    
    file = request.files.get('file')
    filename = None
    if file and file.filename != '':
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    new_courrier = Depart(
        destinataire=destinataire, 
        sujet=sujet, 
        division=division, 
        notes=notes,
        file_path=filename
    )
    db.session.add(new_courrier)
    db.session.commit()
    return jsonify({"status": "success", "message": "تم تسجيل المراسلة الصادرة بنجاح!"})

# 7. صفحة الأرشيف والبحث المتقدم
@app.route('/archive')
def archive():
    return render_template('archive.html')

# 8. مسار آمن لفتح وتحميل ملفات الـ PDF المرفوعة
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ============================================================
# RUN SERVER (إنشاء الجداول وتشغيل السيرفر)
# ============================================================
with app.app_context():
    db.create_all() # صاوب ملف database.db تلقائياً إلا مكانش

if __name__ == '__main__':
    app.run(debug=True)