function calcolaGradazione() {
    // Leggi i valori inseriti dall'utente
    let zucchero = parseFloat(document.getElementById('zucchero').value);
    let acqua = parseFloat(document.getElementById('acqua').value);
    let alcool = parseFloat(document.getElementById('alcool').value);
    let gradAlcool = parseFloat(document.getElementById('gradAlcool').value);

    // Calcola il volume dello zucchero
    let pesoSpecZucchero = 1.59; // peso specifico dello zucchero
    let volumeZucchero = zucchero / pesoSpecZucchero;

    // Somma i volumi
    let volumeTotale = volumeZucchero + acqua + alcool;

    // Calcola il volume alcolico dell'alcool
    let volumeAlcolicoAlcool = alcool * (gradAlcool / 100);

    // Calcolo della gradazione alcolica finale
    let gradazioneFinale = (volumeAlcolicoAlcool / volumeTotale) * 100;

    // Mostra il risultato
    document.getElementById('result').innerHTML = `La gradazione alcolica è: ${gradazioneFinale.toFixed(2)}% vol`;
}

function calcolaAcquaZucchero() {
    // Leggi i valori inseriti dall'utente
    let alcool = parseFloat(document.getElementById('alcoolInverso').value);
    let gradAlcool = parseFloat(document.getElementById('gradAlcoolInverso').value);
    let gradDesiderata = parseFloat(document.getElementById('gradDesiderata').value);
    let proporzione = document.getElementById('proporzione').value;

    // Estrai la proporzione zucchero:acqua dal dropdown
    let proporzioni = proporzione.split(":").map(Number);
    let proporzioneZucchero = proporzioni[0];  // Es. 8 parti zucchero (in grammi)
    let proporzioneAcqua = proporzioni[1];     // Es. 11 parti acqua (in ml)

    // Calcola il volume totale desiderato per raggiungere la gradazione specificata
    let volumeTotaleDesiderato = (alcool * gradAlcool) / gradDesiderata;

    // Calcola il volume di acqua + zucchero da aggiungere
    let volumeAggiuntivo = volumeTotaleDesiderato - alcool; // volume totale da aggiungere (acqua + zucchero)

    // Calcolo di acqua e zucchero rispettando la proporzione
    let rapportoAcquaZucchero = proporzioneAcqua / proporzioneZucchero; // es. 11/8
    let acqua = volumeAggiuntivo / (1 + (1 / rapportoAcquaZucchero)); // volume acqua in ml
    let zuccheroPeso = acqua / rapportoAcquaZucchero; // zucchero in grammi

    // Mostra il risultato
    document.getElementById('resultInv').innerHTML = `
        Per ottenere ${gradDesiderata}% vol di gradazione:<br>
        - Aggiungi ${acqua.toFixed(2)} ml di acqua<br>
        - Aggiungi ${zuccheroPeso.toFixed(2)} grammi di zucchero
    `;
}
