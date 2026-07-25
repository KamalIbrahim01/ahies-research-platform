from flask import jsonify, request
from sqlalchemy import text
from .knowledge import KNOWLEDGE

from . import app, db


# ======================================================
# OVERVIEW
# ======================================================

@app.route("/api/overview")
def overview():

    query = text("""
        SELECT
            COUNT(*) AS total_records,
            COUNT(DISTINCT household_id) AS total_households,
            MIN(year) AS start_year,
            MAX(year) AS end_year
        FROM ahies_master
    """)

    result = db.session.execute(query).mappings().first()

    return jsonify(dict(result))


# ======================================================
# EDUCATION OVERVIEW
# ======================================================

@app.route("/api/education")
def education():

    query = text("""
        SELECT
            year,
            COUNT(*) AS total_records,

            SUM(
                CASE
                    WHEN ever_attended_school IN (
                        'Attended in the past',
                        'Attending now'
                    ) THEN 1
                    ELSE 0
                END
            ) AS ever_attended_school,

            SUM(
                CASE
                    WHEN currently_in_school = 'Yes' THEN 1
                    ELSE 0
                END
            ) AS currently_in_school

        FROM ahies_master

        GROUP BY year
        ORDER BY year
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# EDUCATION - HIGHEST EDUCATIONAL ATTAINMENT
# ======================================================

@app.route("/api/education/attainment")
def education_attainment():

    query = text("""
        SELECT
            year,
            highest_education_level AS education_level,
            COUNT(*) AS total

        FROM ahies_master

        WHERE highest_education_level IS NOT NULL

        GROUP BY
            year,
            highest_education_level

        ORDER BY
            year,
            total DESC
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# EDUCATION - REASONS FOR NEVER ATTENDING SCHOOL
# ======================================================

@app.route("/api/education/barriers")
def education_barriers():

    query = text("""
        SELECT
            year,
            reason_never_attended_school AS reason,
            COUNT(*) AS total

        FROM ahies_master

        WHERE reason_never_attended_school IS NOT NULL

        GROUP BY
            year,
            reason_never_attended_school

        ORDER BY
            year,
            total DESC
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# HEALTH OVERVIEW
# ======================================================

@app.route("/api/health")
def health():

    query = text("""
        SELECT
            year,
            COUNT(*) AS total_records,

            SUM(
                CASE
                    WHEN currently_covered_nhis = 'Yes, covered'
                    THEN 1
                    ELSE 0
                END
            ) AS nhis_covered,

            SUM(
                CASE
                    WHEN illness_last_two_weeks IN (
                        'Illness',
                        'Both'
                    )
                    THEN 1
                    ELSE 0
                END
            ) AS recent_illness,

            SUM(
                CASE
                    WHEN consulted_health_practitioner = 'Yes'
                    THEN 1
                    ELSE 0
                END
            ) AS consulted_health_practitioner

        FROM ahies_master

        GROUP BY year
        ORDER BY year
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# HEALTH - ILLNESS BY SEX
# ======================================================

@app.route("/api/health/illness-by-sex")
def health_illness_by_sex():

    query = text("""
        SELECT
            year,
            sex,
            COUNT(*) AS total

        FROM ahies_master

        WHERE illness_last_two_weeks IN (
            'Illness',
            'Both'
        )

        AND sex IS NOT NULL

        GROUP BY
            year,
            sex

        ORDER BY
            year,
            total DESC
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# HEALTH - CURRENT NHIS COVERAGE
# ======================================================

@app.route("/api/health/coverage")
def health_coverage():

    query = text("""
        SELECT
            year,
            currently_covered_nhis AS coverage_status,
            COUNT(*) AS total

        FROM ahies_master

        WHERE currently_covered_nhis IS NOT NULL

        GROUP BY
            year,
            currently_covered_nhis

        ORDER BY
            year,
            total DESC
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# LABOUR
# ======================================================

@app.route("/api/labour")
def labour():

    query = text("""
        SELECT
            year,
            COUNT(*) AS total_records,

            SUM(
                CASE
                    WHEN worked_for_pay = 'Yes'
                    THEN 1
                    ELSE 0
                END
            ) AS worked_for_pay,

            SUM(
                CASE
                    WHEN actively_looking_for_work = 'Yes'
                    THEN 1
                    ELSE 0
                END
            ) AS actively_looking_for_work,

            SUM(
                CASE
                    WHEN social_security = 'Yes'
                    THEN 1
                    ELSE 0
                END
            ) AS social_security

        FROM ahies_master

        GROUP BY year
        ORDER BY year
    """)

    results = db.session.execute(query).mappings().all()

    return jsonify([dict(row) for row in results])


# ======================================================
# KNOWLEDGE
# ======================================================

@app.route("/api/knowledge")
def knowledge():

    return jsonify({

        key: {

            "title": section["title"],
            "questions": list(section["questions"].keys())

        }

        for key, section in KNOWLEDGE.items()

    })


# ======================================================
# RESEARCH ASSISTANT
# ======================================================

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json() or {}

    category = data.get("category")
    question = data.get("question")

    if not category or not question:

        return jsonify({
            "response": "Invalid request."
        }), 400

    section = KNOWLEDGE.get(category)

    if section is None:

        return jsonify({
            "response": "Unknown category."
        }), 404

    response = section["questions"].get(question)

    if response is None:

        return jsonify({
            "response": "Question not found."
        }), 404

    return jsonify({
        "response": response
    })