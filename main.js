var c = 1;
var previousCounts = [];

// Fonction pour formater les nombres avec un 0 si inférieur à 10
function formatNumber(num) {
  return num < 10 ? '0' + num : num;
}

// Initialisation de l'interface Top 50
for (var l = 1; l <= 5; l++) {
  var htmlrow = `<div class="row_${l} row"></div>`;
  $('.counters').append(htmlrow);
  for (var t = 1; t <= 10; t++) {
    var formattedNumber = formatNumber(c);
    var htmlcard = `<div class="channel_${c} card flame">
      <div class="cnb">${formattedNumber}</div>
      <img src="https://yt3.ggpht.com/zXXKbMHDXl0H7YYBc4Wt0ivDFu--TAhuoOlLkoURrZGxA9aI4LhiVefuEZOHoPxQxxLX5GkjhA=s240-c-k-c0x00ffffff-no-rj" alt="" class="cimage">
      <div class="cname">Pandza 7</div>
      <div class="subscriberCount odometer">0</div>
    </div>`;
    $('.row_' + l).append(htmlcard);
    previousCounts.push(0);  // Initialiser les nombres d'abonnés précédents à 0
    c += 1;
  }
}

// Connexion WebSocket au serveur
const ws = new WebSocket("wss://shortprank509-art.github.io");

// Délai ajustable pour les mises à jour de chaque compteur
const updateDelay = 50; // Réglable selon les préférences

ws.onopen = function () {
  console.log("Connecté au serveur WebSocket");
};

ws.onmessage = function (event) {
  const message = JSON.parse(event.data);
  
  if (message.type === 'ping') {
    // Optionnel : Répondre avec "pong" si le serveur attend une confirmation
    ws.send(JSON.stringify({ type: 'pong' }));
  } else {
    console.log("Données reçues :", message);

    // Mise à jour des données des chaînes dans le Top 50 avec vérification
    if (Array.isArray(message) && message.length > 0) {
      message.forEach((channelData, index) => {
        if (parseInt(channelData.subscriberCount) !== previousCounts[index]) {
          setTimeout(() => {
            updateData(index, message);
          }, index * updateDelay);
        }
      });
    } else {
      console.warn("Format inattendu des données reçues :", message);
    }
  }
};

// Fonction pour mettre à jour les données de chaque chaîne si nécessaire
function updateData(q, data) {
  var cnb = q + 1;
  var currentCount = parseInt(data[q].subscriberCount);
  
  if (previousCounts[q] !== currentCount) {
    $(".channel_" + cnb + " .cimage").attr("src", data[q].cimage); 
    $(".channel_" + cnb + " .cname").html(data[q].cname);
    $(".channel_" + cnb + " .subscriberCount").html(currentCount);

    // Appliquer les couleurs en fonction de l'évolution des abonnés
    if (previousCounts[q] < currentCount) {
      $(".channel_" + cnb).css({ "background-color": "rgb(212, 241, 222)", "opacity": 1 });
    } else {
      $(".channel_" + cnb).css({ "background-color": "rgb(241, 222, 222)", "opacity": 1 });
    }

    previousCounts[q] = currentCount; // Mise à jour du compteur précédent

    // Réinitialiser la couleur après 1,5 secondes
    setTimeout(() => {
      $(".channel_" + cnb).css({ "background-color": "white", "opacity": 1 });
    }, 1500);
  }
}

ws.onclose = function () {
  console.log("Connexion WebSocket fermée");
};

ws.onerror = function (error) {
  console.error("Erreur WebSocket :", error);
};

// Afficher le contenu après chargement
$(document).ready(function() {
  $('.counters').fadeIn();
});
