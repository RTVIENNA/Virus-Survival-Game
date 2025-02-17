// Liste von Virennamen (diese werden als Beispiel verwendet)
const virusNames = [
    'Influenza Virus', 'Flu Virus', 'SARS-CoV-2', 'COVID-19 Virus',
    'HIV', 'Human Immunodeficiency Virus', 'Hepatitis B Virus',
    'Hepatitis C Virus', 'Dengue Virus', 'Zika Virus',
    'Ebola Virus', 'Marburg Virus', 'Rotavirus',
    'Tobacco Mosaic Virus', 'Rice Yellow Mottle Virus',
    'Tomato Spotted Wilt Virus', 'Rabies Virus',
    'Avian Influenza Virus', 'Foot-and-Mouth Disease Virus',
    'Rinderpest Virus', 'Smallpox Virus', 'Measles Virus',
    'Mumps Virus', 'Norovirus', 'Rhinovirus', 'Cytomegalovirus',
    'Epstein-Barr Virus', 'Varicella-Zoster Virus',
    'Human Papillomavirus', 'West Nile Virus', 'Hantavirus',
    'Yellow Fever Virus', 'Lassa Virus',
];

// Definition der Virus-Klasse
// Diese Klasse repräsentiert ein Virus mit einem Namen und Punkte
class Virus {
    constructor(name, life) {
        this.name = name; // Speichert den Namen des Virus
        this.life = life; // Speichert die Lebenspunkte des Virus
    }

    // Methode, die das Würfeln mit zwei sechsseitigen Würfeln simuliert
    rollDice() {
        // Generiert zwei Zufallszahlen zwischen 1 und 6 und summiert sie 
        return Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
    }
}

// Definition der Köper-Klasse
// Diese Klasse repräsentiert einen Körper, der mehrere Viren enthält
class Body {
    constructor(virusNames, strongVirusLife) {
        // Erzeugt ein Array von Viren
        // Die ersten 3 Viren haben stärkere Lebensenergie ("strongVirusLife")
        // Die restlichen Viren haben eine Lebensenergie von 10
        this.viruses = virusNames.map((name, i) =>
            new Virus(name, i < 3 ? strongVirusLife : 10)
        );
    }

    //  Wettbewerbs zwischen den Viren
    async compete(logElement, barChartElement) {
        let rounds = 0; // Zählt die Anzahl der Runden beginnend mit NUll

        // Schleife läuft, solange mehr als ein Virus im Array ist
        while (this.viruses.length > 1) {
            rounds++; // Erhöht die Rundenzahl um 1

            // Wählt zwei zufällige Viren aus dem Array aus
            const [virus1, virus2] = this.randomTwoViruses();

            // Beide Viren würfeln, jeweils zwei Würfel werden simuliert- dies bestimmt die Lebensenergie der Viren
            const result1 = virus1.rollDice();
            const result2 = virus2.rollDice();

            // Protokolliert das Ergebnis der Runde im Log-Element
            const loser = result1 > result2 ? virus2.name : virus1.name; // Bestimmt den Verlierer
            
            logElement.innerHTML += `<p>Round ${rounds}: ${virus1.name} (LifePoints: ${result1}) vs ${virus2.name} (LifePoints: ${result2}) -  ${loser} loses</p>`;
            //zeigt das Ergebnis der Runde im Log-Element
            
            logElement.scrollTop = logElement.scrollHeight; 
            // Scrollt automatisch nach unten, um das neueste Ergebnis anzuzeigen

            // Vergleicht die Würfelergebnisse und reduziert die Lebensenergie des Verlierers
            if (result1 > result2) {
                virus2.life--; // Virus 2 verliert Lebensenergie
            } else if (result1 < result2) {
                virus1.life--; // Virus 1 verliert Lebensenergie
            }

            // Entfernt Viren aus dem Array, deren Lebensenergie 0  ist
            this.viruses = this.viruses.filter(v => v.life > 0);

            // Aktualisiert die grafische Darstellung der Lebensenergie der Viren
            this.updateVisualization(barChartElement);

            // Wartet 10 Millisekunden vor der nächsten Runde
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Wenn nur noch ein Virus übrig ist, wird der Gewinner bekannt gegeben
        logElement.innerHTML += `<p><strong>The game is over! The Winner is: ${this.viruses[0].name} after ${rounds} rounds.</strong></p>`;
        return rounds; // Gibt die Anzahl der Runden zurück
    }

    // Methode, die zwei zufällige Viren aus dem Array auswählt
    randomTwoViruses() {
        // Erstellt eine Liste mit den Werten aller Viren
        const indices = Array.from({ length: this.viruses.length }, (_, i) => i);

        // Wählt einen zufälligen Wert und entfernt ihn aus der Liste
        const randomIndex1 = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];

        // Wählt einen zweiten zufälligen Wert aus der verbleibenden Liste
        const randomIndex2 = indices[Math.floor(Math.random() * indices.length)];

        // Gibt die beiden ausgewählten Viren zurück
        return [this.viruses[randomIndex1], this.viruses[randomIndex2]];
    }

    //  Grafische Darstellung der Viren aktualisiert
    updateVisualization(barChartElement) {
        barChartElement.innerHTML = ''; // Löscht die bisherige Darstellung

        // Für jedes Virus wird ein Balken erstellt, der seine Lebensenergie darstellt
        this.viruses.forEach((virus, index) => {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

            // Setze SVG-Attribute für den Balken
            rect.setAttribute("x", index * 25); // Position mit Abstand
            rect.setAttribute("y", 200 - virus.life * 10); // Höhe relativ zu SVG unten
            rect.setAttribute("width", 20); // Breite des Balkens
            rect.setAttribute("height", virus.life * 10); // Höhe proportional zur Lebensenergie
            rect.setAttribute("fill", "darkblue"); // Füllfarbe des Balkens

            // Tooltip mit Virusname und Lebensenergie
            rect.setAttribute("data-name", `${virus.name}: ${virus.life}`);

            // Füge den Balken dem SVG hinzu
            barChartElement.appendChild(rect);
        });
    }
}

// Event-Listener für den Start-Button
// Wird ausgeführt, wenn der Nutzer auf den "Start Game"-Button klickt
document.getElementById("startGame").addEventListener("click", () => {
    // Liest die Lebensenergie der starken Viren aus dem Eingabefeld
    const strongVirusLife = parseInt(document.getElementById("strongVirusLife").value, 10);

    // Überprüft, ob die Eingabe eine gültige Zahl ist (zwischen 10 und 20)
    if (isNaN(strongVirusLife) || strongVirusLife < 10 || strongVirusLife > 20) {
        alert("Please enter a valid life energy between 10 and 20."); // Zeigt eine Fehlermeldung an
        return; // Bricht die Funktion ab, falls die Eingabe ungültig ist
    }


    // Erstellt ein neues Body-Objekt mit den Virennamen und der Lebensenergie der starken Viren
    const body = new Body(virusNames, strongVirusLife);

    // Referenzen auf die HTML-Elemente für das Log und das Balkendiagramm
    const logElement = document.getElementById("log");
    const barChartElement = document.getElementById("barChart");

    logElement.innerHTML = ''; // Leert das Log
    barChartElement.innerHTML = ''; // Leert das Balkendiagramm

    // Startet den Wettbewerb der Viren und übergibt die HTML-Elemente
    body.compete(logElement, barChartElement);
});
