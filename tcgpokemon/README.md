# Justificación del Modelo Entidad-Relación de Pokémon Trading Card Game

## Introducción

El presente documento justifica el diseño del modelo entidad-relación (ER) desarrollado para representar el juego de cartas coleccionables Pokémon Trading Card Game (TCG). Este modelo captura tanto los elementos estáticos del juego (cartas, jugadores, mazos) como los elementos dinámicos (partidas, turnos, eventos), proporcionando una estructura robusta para su implementación en una base de datos relacional.

## 1. Justificación de las Entidades

### 1.1 Card (Carta)

**Propósito**: Entidad base que representa cualquier carta del juego Pokémon TCG.

**Justificación**: Esta entidad sirve como superclase para todas las cartas del juego, implementando el patrón de herencia. Esta abstracción permite mantener atributos comunes a todas las cartas en un único lugar, facilitando la extensibilidad y mantenibilidad del modelo.

**Atributos**:
- `id_card`: Identificador único de la carta
- `Name`: Nombre de la carta
- `Type`: Tipo general de la carta (pokémon, entrenador, energía)
- `Description`: Descripción general de la carta

### 1.2 PokemonCard

**Propósito**: Especialización de Card para representar cartas de Pokémon.

**Justificación**: Las cartas de Pokémon tienen características únicas que las distinguen de otros tipos de cartas, como puntos de salud, tipo elemental y etapa evolutiva. Esta especialización permite modelar estas características específicas sin sobrecargar la entidad base.

**Atributos específicos**:
- `health`: Puntos de salud del Pokémon
- `type`: Tipo elemental (fuego, agua, eléctrico, etc.)
- `abilities`: Habilidades especiales
- `stage`: Etapa evolutiva (básico, etapa 1, etapa 2)

### 1.3 TrainerCard

**Propósito**: Especialización de Card para cartas de entrenador.

**Justificación**: Las cartas de entrenador proporcionan efectos especiales y estrategias durante el juego. Su modelado separado permite capturar la naturaleza única de estas cartas y sus diferentes subtipos.

**Atributos específicos**:
- `ability`: Efecto específico de la carta
- `subtype`: Categoría de entrenador (Item, Supporter, Tool)

### 1.4 StadiumCard

**Propósito**: Tipo especial de carta que modifica el campo de juego.

**Justificación**: Los estadios tienen un comportamiento único al permanecer en juego y afectar a ambos jugadores. Esta entidad captura esa funcionalidad especial.

**Atributos específicos**:
- `ability`: Efecto del estadio mientras está en juego

### 1.5 EnergyCard

**Propósito**: Especialización para cartas de energía.

**Justificación**: Las cartas de energía son fundamentales para el funcionamiento del juego, permitiendo a los Pokémon usar sus ataques. Su modelado separado facilita el manejo de diferentes tipos de energía.

**Atributos específicos**:
- `energy_type`: Tipo de energía proporcionada

### 1.6 Player

**Propósito**: Representa a los jugadores del juego.

**Justificación**: Entidad central que mantiene información sobre los participantes, sus colecciones y estadísticas. Es fundamental para la gestión de usuarios y seguimiento del progreso.

**Atributos**:
- `id_player`: Identificador único
- `name`: Nombre del jugador
- `age`: Edad
- `birth_date`: Fecha de nacimiento

### 1.7 Deck

**Propósito**: Conjunto de cartas preparado para jugar.

**Justificación**: Los mazos son elementos fundamentales del juego, con reglas específicas de construcción (60 cartas, límites de copias). Esta entidad permite gestionar múltiples mazos por jugador.

**Atributos**:
- `id_deck`: Identificador único
- `deck_name`: Nombre del mazo
- `deck_date`: Fecha de creación

### 1.8 Inventory

**Propósito**: Colección completa de cartas de un jugador.

**Justificación**: Diferencia entre cartas poseídas y cartas en uso en mazos. Permite gestionar la colección total de un jugador, facilitando el comercio y la construcción de mazos.

**Atributos**:
- `id_inventory`: Identificador único
- `card_collection`: Referencia a la colección de cartas

### 1.9 DeckCard (Tabla Asociativa)

**Propósito**: Resuelve la relación N:M entre Deck y Card.

**Justificación**: Permite que una carta aparezca múltiples veces en un mazo (hasta el límite permitido por las reglas). Esta tabla asociativa es esencial para mantener la integridad de los mazos.

**Atributos**:
- `quantity`: Cantidad de copias de la carta en el mazo

### 1.10 Match

**Propósito**: Representa una partida entre dos jugadores.

**Justificación**: Captura el aspecto dinámico del juego, permitiendo registrar partidas completas con sus resultados y duración.

**Atributos**:
- `id_match`: Identificador único
- `length`: Duración de la partida
- `id_winner`: Referencia al jugador ganador

### 1.11 Turn

**Propósito**: Representa cada turno dentro de una partida.

**Justificación**: Los turnos son la unidad básica de tiempo en el juego. Esta entidad permite registrar la secuencia de acciones y mantener el orden del juego.

**Atributos**:
- `id_turn`: Identificador único
- `turn_number`: Número secuencial del turno

### 1.12 MatchEvents

**Propósito**: Registra eventos específicos durante la partida.

**Justificación**: Permite un registro detallado de las acciones realizadas durante el juego, útil para análisis, repeticiones y validación de reglas.

**Atributos**:
- `id_matchEvent`: Identificador único
- `card_used`: Carta utilizada en el evento
- `ability_activated`: Habilidad activada

### 1.13 GeneralStats

**Propósito**: Almacena estadísticas acumulativas del jugador.

**Justificación**: Mantiene un registro histórico del rendimiento del jugador, facilitando sistemas de clasificación, matchmaking y seguimiento de progreso.

**Atributos**:
- `wins`: Victorias totales
- `losses`: Derrotas totales
- `matches_played`: Partidas jugadas
- `hours_played`: Horas de juego
- `number_of_cards`: Cantidad de cartas en colección
- `level`: Nivel del jugador

## 2. Justificación de las Relaciones

### 2.1 Herencia de Card

**Relación**: Card → PokemonCard, TrainerCard, StadiumCard, EnergyCard

**Justificación**: Implementa el patrón de especialización/generalización, permitiendo que todas las cartas compartan atributos comunes mientras mantienen sus características específicas. Esto facilita consultas polimórficas y mantenimiento del código.

### 2.2 Player - Deck (1:N)

**Justificación**: Un jugador puede poseer múltiples mazos para diferentes estrategias o formatos de juego, pero cada mazo pertenece a un único jugador.

### 2.3 Deck - Card (N:M a través de DeckCard)

**Justificación**: Una carta puede aparecer en múltiples mazos y un mazo contiene múltiples cartas. La tabla asociativa DeckCard permite controlar la cantidad de copias respetando las reglas del juego.

### 2.4 Player - Inventory (1:1)

**Justificación**: Cada jugador tiene exactamente un inventario que contiene toda su colección de cartas.

### 2.5 Inventory - Card (N:M)

**Justificación**: Un inventario puede contener múltiples cartas (incluyendo copias) y una misma carta puede estar en inventarios de diferentes jugadores.

### 2.6 Match - Player (N:2)

**Justificación**: Cada partida involucra exactamente dos jugadores, estableciendo una relación binaria específica.

### 2.7 Match - Turn (1:N)

**Justificación**: Una partida se compone de múltiples turnos secuenciales, cada uno perteneciente a una única partida.

### 2.8 Turn - MatchEvents (1:N)

**Justificación**: Durante cada turno pueden ocurrir múltiples eventos (jugar cartas, activar habilidades), cada evento pertenece a un turno específico.

### 2.9 Player - GeneralStats (1:1)

**Justificación**: Cada jugador tiene exactamente un conjunto de estadísticas generales que se actualizan continuamente.
