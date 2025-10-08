from ModuloAI.analyzer import analyze_performance
from ModuloAI.recommender import recommend_next


def run_demo():

    # Se crea un diccionario que recopila los parametros del niño en el juego pertinente
    data = {"correct": 7, "errors": 3, "time": 120}

    print(data)

    # ** Para desempaquetar el diccionario y pasarlo como parametros a la funcion para analizar el performance
    analysis = analyze_performance(**data)

    # Se hace la sugerencia con base en el valor del performance en el diccionario de analisis
    suggestion = recommend_next(analysis["performance"])

    print(analysis, suggestion)

if __name__ == "__main__":
    run_demo()