def recommend_next(performance):
    """

    :param performance:
    :return:

    Siguiente actividad recomendada con base en el performance previo del usuario
    """

    if performance == "low":
        return {
            "next_module": "Sensorial", "difficulty": 1
        }

    elif performance == "medium":
        return {
            "next_module": "Cognitivo", "difficulty": 2
        }

    else:
        return {
            "next_module": "Memoria", "difficulty": 3
        }
