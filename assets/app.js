
let totalPlayers = 0;
let currentPlayer = 0;
let traitors = [];
let commonWord = "";
let players = [];
let screen = document.getElementById("app");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    totalPlayers = parseInt(document.getElementById("playerCount").value);
    currentPlayer = 1;
    traitors = [];

    // Choisir mot commun
    const wordPoolCopy = [...WORDS];
    commonWord = wordPoolCopy.splice(Math.floor(Math.random() * wordPoolCopy.length), 1)[0];

    // Déterminer les traîtres
    if (totalPlayers >= 7) {
        while (traitors.length < 2) {
            let t = Math.floor(Math.random() * totalPlayers);
            if (!traitors.includes(t)) traitors.push(t);
        }
    } else {
        traitors = [Math.floor(Math.random() * totalPlayers)];
    }

    // Créer les cartes des joueurs
    players = [];
    for (let i = 0; i < totalPlayers; i++) {
        let words = [];
        const localPool = wordPoolCopy.slice();
        shuffle(localPool);

        if (traitors.includes(i)) {
            words = localPool.slice(0, 3);
        } else {
            words = localPool.slice(0, 2);
            words.push(commonWord);
            shuffle(words);
        }

        players.push(words);
    }

    showPassScreen();
}

function showPassScreen() {
    screen.innerHTML = `
        <h2>Joueur ${currentPlayer}, prenez le téléphone</h2>
        <p>Appuyez sur Valider pour découvrir vos mots</p>
        <button onclick="showWords()">Valider</button>
    `;
}

function showWords() {
    const words = players[currentPlayer - 1];
    screen.innerHTML = `
        <div class="word">${words[0]}</div>
        <div class="word">${words[1]}</div>
        <div class="word">${words[2]}</div>
        <button onclick="nextPlayer()">Valider</button>
    `;
}

function nextPlayer() {
    currentPlayer++;
    if (currentPlayer <= totalPlayers) {
        showPassScreen();
    } else {
        showWaitScreen();
    }
}

function showWaitScreen() {
    screen.innerHTML = `
        <h2>La partie est en cours...</h2>
        <p>Quand vous êtes prêts, cliquez pour révéler le mot de passe et le(s) traître(s) !</p>
        <button onclick="showResult()">Révéler</button>
    `;
}

function showResult() {
    const traitorList = traitors.map(i => `Joueur ${i + 1}`).join(" et ");
    screen.innerHTML = `
        <h2>Mot de passe : ${commonWord}</h2>
        <h2>Traître${traitors.length > 1 ? 's' : ''} : ${traitorList}</h2>
        <button onclick="location.reload()">Nouvelle partie</button>
    `;
}
