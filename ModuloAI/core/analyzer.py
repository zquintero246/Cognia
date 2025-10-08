

def analyze_performance(correct, errors, time):
    """
    :param correct:
    :param errors:
    :param time:
    :return:

    Función que analiza el desempeño del usuario con base en ciertas metricas
    """

    total = correct + errors

    # Se calcula que tan acertado fue el usuario (ej: 16/20 = 0.8)
    user_accuracy = correct / total if total > 0 else 0

    # Se declara el performance del usuario en la actividad especifica
    performance = "low" if user_accuracy < 0.6 else "medium" if user_accuracy < 0.85 else "high"

    return {
        "accuracy": user_accuracy, "performance": performance
    }


