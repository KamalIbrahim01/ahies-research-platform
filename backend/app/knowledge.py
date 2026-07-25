"""
AHIES Research Platform Knowledge Base
"""

KNOWLEDGE = {

    "dataset": {

        "title": "Dataset",

        "questions": {

            "What is AHIES?":
            """
The Annual Household Income and Expenditure Survey (AHIES) is a nationally
representative survey conducted by the Ghana Statistical Service.

It provides detailed information on households, income, expenditure,
education, health, labour and living conditions.

The AHIES Research Platform integrates the 2022, 2023 and 2024 surveys
into a single analytical database for research and visualization.
            """,

            "What years are included?":
            """
The platform currently contains survey data for:

• 2022
• 2023
• 2024
            """,

            "How many records are available?":
            """
The integrated AHIES database contains approximately

• 595,396 individual records

covering

• 121,671 households.
            """,

            "How was the dataset prepared?":
            """
The dataset was cleaned using Python.

The preparation process included

• standardizing columns

• validating records

• removing duplicates

• handling missing values

• integrating yearly datasets

• loading the final dataset into MySQL.
            """

        }

    },

    "education": {

        "title": "Education",

        "questions": {

            "What education indicators are available?":
            """
The Education module includes

• School attendance

• Current enrolment

• Educational attainment

• Literacy

• Education expenditure

• Barriers to education
            """,

            "What is educational attainment?":
            """
Educational attainment measures the highest level of education completed
by each respondent.

The platform compares attainment across survey years.
            """,

            "What are barriers to education?":
            """
The platform analyses reasons respondents never attended school,
supporting educational policy and planning.
            """

        }

    },

    "health": {

        "title": "Health",

        "questions": {

            "What health indicators are available?":
            """
The Health module includes

• NHIS coverage

• Illness

• Healthcare utilization

• Medical expenditure

• Disability
            """,

            "What is NHIS coverage?":
            """
NHIS coverage indicates whether a respondent is currently enrolled
in Ghana's National Health Insurance Scheme.
            """

        }

    },

    "labour": {

        "title": "Labour",

        "questions": {

            "What labour indicators are available?":
            """
The Labour module analyses

• Employment

• Occupation

• Job search activity

• Earnings

• Social security
            """,

            "What is social security?":
            """
Social security identifies whether respondents contribute
to a recognized social protection scheme.
            """

        }

    },

    "methodology": {

        "title": "Methodology",

        "questions": {

            "Describe the data preparation methodology":
            """
The platform follows an ETL workflow.

1. Extract raw AHIES data.

2. Clean and standardize variables.

3. Validate records.

4. Handle missing values.

5. Load into MySQL.

6. Serve data through Flask APIs.

7. Visualize using Chart.js and Power BI.
            """,

            "How were missing values handled?":
            """
Missing values were preserved whenever they represented
non-applicable survey questions.

This avoids introducing misleading information into
the analysis.
            """

        }

    }

}