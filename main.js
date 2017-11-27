// Importa somente o submodulo app, buscando dentro do objeto electron. O mesmo ocorre com o BrowserWindow.
// Isto funciona atravez das { } assim não importando todo o objeto electron. destructuring
// O submodulo app é responsavel por controlar o ciclo de vida da aplicação.
// O submodulo BrowserWindow é responsavel por criar janelas.
// O submodulo ipcMain é responsavel por escutar os eventos enviados pelo ipcRenderer.
// O submodulo globalShortcut é responsavel por configurar os atalhos globais, que são executados quando a aplicação não está em foco.
const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron'); 
const data = require('./data');
const templateGenerator = require('./template');

let tray = null;
let mainWindow = null;
app.on('ready', () => {
    console.log('Aplicação Iniciada');
    //Janela principal
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400
    });
    tray = new Tray(__dirname + '/app/img/icon-tray.png');
    let template = templateGenerator.geraTrayTemplate(mainWindow);
    let trayMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(trayMenu);    

    let templateMenu = templateGenerator.geraMenuPrincipalTemplate(app);
    let menuPrincipal = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(menuPrincipal);

    globalShortcut.register('CmdOrCtrl+Shift+S', () => {
        mainWindow.send('atalho-iniciar-parar');
    });

    // Quando se configura um menu principal, se perde os menus padrões do electron, uma solução é utilizar este método para abrir as opções de desenvolvimento.
    //mainWindow.openDevTools(); 
    // Irá carregar o arquivo index.html, lembrar de usar o file para o loadURL entender que é local, quando for web utilizar o https.
    // O dirname irá pegar o caminho da pasta atual.
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);

});

// Ao fechar a aplicação irá encerrar nosso aplicativo.
app.on('window-all-closed', () => {
    app.quit();
});

let sobreWindow = null;
ipcMain.on('abrir-janela-sobre', () => {

    if (sobreWindow == null) {
        sobreWindow = new BrowserWindow({
            width: 300,
            height: 220,
            alwaysOnTop: true, // Mantém a tela acima das demais.
            frame: false // Remove as bordas e menu da tela.
        });        

        sobreWindow.on('closed', () => {
            sobreWindow = null;
        });
    }   

    sobreWindow.loadURL(`file://${__dirname}/app/sobre.html`); 
});

ipcMain.on('fechar-janela-sobre', () => {
    sobreWindow.close();
});

ipcMain.on('curso-parado', (event, curso, tempoEstudado) => {
    data.salvaDados(curso, tempoEstudado);
});

ipcMain.on('curso-adicionado', (event, novoCurso) => {
    let novoTemplate = templateGenerator.adicionarCursoNoTray(novoCurso, mainWindow);
    let novoTrayMenu = Menu.buildFromTemplate(novoTemplate);
    tray.setContextMenu(novoTrayMenu);
});