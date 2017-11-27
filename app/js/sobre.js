// O shell é utilizado para executar programas do sistema operacional.
const { ipcRenderer, shell } = require('electron');
// O process utiliza a biblioteca do proprio node.
const process = require('process');

let linkFechar = document.querySelector("#link-fechar");
let linkTwitter = document.querySelector("#link-twitter");
let versaoElectron = document.querySelector('#versao-electron');

window.onload = function() {
    versaoElectron.textContent = process.versions.electron;
};

linkFechar.addEventListener('click', function() {
    ipcRenderer.send('fechar-janela-sobre');
});

linkTwitter.addEventListener('click', function() {
    // Utilizado para abrir o link no browser local e não nas janelas do electron(chromium).
    shell.openExternal("https://www.facebook.com/juliano490");
});