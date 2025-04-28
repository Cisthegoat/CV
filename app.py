import os
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, jsonify, url_for
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import random
from helpers import apology, login_required
from datetime import date, datetime



app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

db = SQL("sqlite:///travel.db")

""" Ensures response aren't cached"""
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/", methods = ["GET", "POST"])
@login_required
def index():
    if request.method == "POST":

        user_type = db.execute("SELECT user_type FROM users WHERE id = ?", session["user_id"])

        print(user_type[0])

        options = []

        if user_type != "traveler":

            pick_up_city = request.form.get("pick_up_city")
            drop_off_city = request.form.get("drop_off_city")

            price = request.form.get("price")

            item_type = request.form.get("item_type")

            depart_date = request.form.get("depart_date")
            arrival_date = request.form.get("arrival_date")

            weight = request.form.get("weight")


            """
            date1 = datetime.strptime(depart_date, "%Y-%m-%d")
            date2 = datetime.strptime(arrival_date, "%Y-%m-%d")

            if date1 > date2:
                print("date1 is after date2")
            elif date1 < date2:
                print("date1 is before date2")
            else:
                print("date1 is the same as date2")


            print("pick up city", pick_up_city)
            print("drop off city", drop_off_city)
            print("price", price)
            print("item_type", item_type)
            print("depart_date", depart_date)
            print("arrival date", arrival_date)
            print("weight", weight)

            """

            """
            options = db.execute("SELECT id, price, username, pick_up_location, drop_off_location, item_type, description, depart_date, arrival_date, weight FROM request WHERE price <= ? AND pick_up_location = ? AND drop_off_location = ? AND item_type = ? AND weight <= ?", price, pick_up_city, drop_off_city, item_type, weight)
            """
            options = db.execute("SELECT user_id, price, username, pick_up_location, drop_off_location, item_type, description, depart_date, arrival_date, weight FROM request WHERE user_id != ?",session["user_id"])
            print("options", options)
        else:
            options = db.execute("SELECT username, origin ,destination, depart_date, arrival_date, weight FROM request WHERE user_id = ?", session["user_id"])

        return render_template("index.html", options = options)

    else:
        return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/profile")
def profile():
    return render_template("profile.html")

@app.route("/messages")
@login_required
def messages():
    sender_id = session["user_id"]
    user_id = session["user_id"]

    recipient_id = request.args.get("recipient_id")

    active_requests = db.execute("SELECT * FROM request WHERE user_id = ? AND status = 'active' ", user_id)

    print("ACTIVE REQUESTS:", active_requests)



    # Récupérer la dernière conversation de l'utilisateur
    latest_conversation = db.execute("""
        SELECT CASE
            WHEN sender_id = ? THEN receiver_id
            ELSE sender_id
        END AS contact_id
        FROM messages
        WHERE sender_id = ? OR receiver_id = ?
        ORDER BY timestamp DESC
        LIMIT 1
    """, user_id, user_id, user_id)

# Si aucun destinataire n'est fourni, rediriger vers la dernière conversation
    if not recipient_id or not recipient_id.isdigit():
        if latest_conversation and latest_conversation[0].get("contact_id"):
            return redirect(url_for("messages", recipient_id=latest_conversation[0]["contact_id"]))
        else:
            return render_template("messages.html", contacts=[], recipient=None, messages=[])

    # Si recipient_id est valide, continuer
    recipient_id = int(recipient_id)


    # Récupérer la liste des contacts
    contacts = db.execute("""
        SELECT users.id, users.username, MAX(messages.timestamp) AS last_message
        FROM messages
        JOIN users ON users.id = CASE
            WHEN messages.sender_id = ? THEN messages.receiver_id
            ELSE messages.sender_id
        END
        WHERE messages.sender_id = ? OR messages.receiver_id = ?
        GROUP BY users.id, users.username
        ORDER BY last_message DESC
    """, user_id, user_id, user_id)

    # Récupérer les infos du destinataire
    recipient = db.execute("SELECT * FROM users WHERE id = ?", recipient_id)
    recipient = recipient[0] if recipient else None  # Évite une liste vide

    messages = db.execute("""
        SELECT 'message' AS type, id, sender_id, receiver_id, content, NULL AS request_id, NULL AS pickup, NULL AS dropoff, NULL AS price, '0' AS is_offer, timestamp, NULL AS status
        FROM messages
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)

        UNION

        SELECT 'offer' AS type, id, sender_id, receiver_id, NULL AS content, request_id, pickup, dropoff, price, '1' AS is_offer, timestamp, status
        FROM offers
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)

        ORDER BY timestamp ASC
    """, sender_id, recipient_id, recipient_id, sender_id, sender_id, recipient_id, recipient_id, sender_id)

    for msg in messages:
        # If the timestamp is a string, convert it to a datetime object
        if isinstance(msg["timestamp"], str):
            msg["timestamp"] = datetime.strptime(msg["timestamp"], "%Y-%m-%d %H:%M:%S")  # Adjust format if needed

        # Now apply strftime to format the timestamp as HH:MM
        msg["timestamp"] = msg["timestamp"].strftime("%H:%M")



    return render_template("messages.html", contacts=contacts, recipient=recipient, messages=messages, active_requests=active_requests)


@app.route('/messages/<int:recipient_id>')
@login_required
def messages_with_recipient(recipient_id):
    return redirect(url_for("messages", recipient_id=recipient_id))


@app.route('/send_message/<int:recipient_id>', methods=['POST'])
@login_required
def send_message(recipient_id):
    message_content = request.form.get("message", "").strip()

    if message_content:
        db.execute("INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
                   session["user_id"], recipient_id, message_content)

    return redirect(url_for("messages", recipient_id=recipient_id))

@app.route("/make_offer/<int:recipient_id>", methods=["POST"])
@login_required
def make_offer(recipient_id):
    user_id = session["user_id"]
    print("IT GOES THROUGH MAKE_OFFER")

    request_id = request.form.get("request_id")

    if not request_id or not request_id.isdigit():
        return redirect(url_for("messages", recipient_id=recipient_id))

    request_id = int(request_id)
    pickup = request.form.get("pickup")
    dropoff = request.form.get("dropoff")
    price = request.form.get("price")

    # Insérer l'offre dans la base de données
    db.execute("""
        INSERT INTO offers (sender_id, receiver_id, request_id, pickup, dropoff, price, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
    """, user_id, recipient_id, request_id, pickup, dropoff, price)


    return redirect(url_for("messages", recipient_id=recipient_id))

@app.route("/accept_offer", methods=["POST"])
@login_required
def accept_offer():
    user_id = session["user_id"]
    offer_id = request.form.get("offer_id")
    print("OFfer_ID", offer_id)

    if not offer_id or not offer_id.isdigit():
        return redirect(url_for("messages"))

    offer_id = int(offer_id)
    offer = db.execute("SELECT * FROM offers WHERE id = ? AND receiver_id = ?", offer_id, user_id)

    if not offer:
        return redirect(url_for("messages"))

    db.execute("UPDATE offers SET status = 'accepted' WHERE id = ?", offer_id)

    db.execute("""
        INSERT INTO messages (sender_id, receiver_id, content, timestamp)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    """, user_id, offer[0]["sender_id"], "Your offer has been accepted!")

    return redirect(url_for("messages", recipient_id=offer[0]["sender_id"]))

@app.route("/decline_offer", methods=["POST"])
def decline_offer():
    data = request.get_json()
    offer_id = data.get("offer_id")

    if not offer_id:
        return jsonify({"success": False, "error": "Missing offer ID"}), 400

    db.execute("UPDATE offers SET status = 'declined' WHERE id = ?", offer_id)

    return jsonify({"success": True})


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/login", methods = ["GET", "POST"])
def login():

    if request.method == "POST":
        if not request.form.get("username"):
            return apology("Must provide username", 403)
        elif not request.form.get("password"):
            return apology("Must provide password", 403)

        user_informations = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        if len(user_informations) != 1 or not check_password_hash(user_informations[0]["hash"], request.form.get("password")):
            return apology("Invalid username and/or password", 403)

        session["user_id"] = user_informations[0]["id"]

        return redirect("/")

    else:
        return render_template("login.html")

@app.route("/register", methods = ["GET", "POST"])
def register():
    if request.method == "POST":
        if not request.form.get("username"):
            return apology("must provide username", 400)
        elif not request.form.get("password"):
            return apology("must provide password", 400)

        user_informations = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        if len(user_informations) != 0:
            return apology("Username already taken, try another one.", 400)

        elif request.form.get("password") != request.form.get("confirmation"):
            return apology("Passwords dont match", 400)

        else:
            user = request.form.get("username")
            password = request.form.get("password")

            hash_password = generate_password_hash(password)

            db.execute("INSERT INTO users (username, hash) VALUES (?, ?)", user, hash_password)

            if request.form.get("email"):
                db.execute("INSERT INTO users email VALUES (?)", email)

            session["user_id"] = ("SELECT id FROM users WHERE username = user")

        flash('Registered!')

        return redirect("/")

    else:
        return render_template("register.html")

