import { loadGetInitialProps } from "next/dist/shared/lib/utils"
import Head from "next/head"
import Script from "next/script"

const train_data = [
    // [munição, ultima ação, munição (jogador), ultima ação (jogador)]
    // ações: 1 = atirar, 2 = defender, 3 = recarregar
    // [0, 1] = 3
    // [1, 2] = 1
    { input: [0, 0, 0, 0], output: { reload: 1 } }, // <-- caso nada tenha sido feito, recarregar a arma
    { input: [0, 0, 1, 2], output: { reload: 1 } },
    { input: [1, 2, 0, 2], output: { shot: 1 } },
    { input: [0, 1, 1, 3], output: { defend: 1 } },
    { input: [2, 3, 3, 3], output: { shot: 1 } },
    { input: [4, 2, 2, 1], output: { defend: 1 } },
    { input: [3, 1, 2, 2], output: { shot: 1 } },
    { input: [2, 1, 2, 1], output: { shot: 1 } },
    { input: [0, 1, 3, 2], output: { defend: 1 } },
    { input: [1, 3, 1, 3], output: { shot: 1 } },
    { input: [1, 2, 0, 1], output: { defend: 1 } },
    { input: [1, 3, 1, 3], output: { shot: 1 } },
    { input: [0, 1, 0, 1], output: { defend: 1 } },
    { input: [0, 3, 1, 2], output: { shot: 1 } },
    { input: [0, 3, 4, 3], output: { defend: 1 } },
    { input: [0, 2, 3, 3], output: { reload: 1 } },
    { input: [1, 2, 0, 2], output: { shot: 1 } },
    { input: [0, 2, 1, 3], output: { reload: 1 } },
    { input: [0, 2, 0, 1], output: { reload: 1 } },
    { input: [1, 3, 0, 1], output: { shot: 1 } },
]

function playGame() {
    return (
        <>
            <Head>
                <title>kk bora jogar rapeize</title>
            </Head>
            <Script 
                id="game-script" 
                src="https://unpkg.com/brain.js"
                onLoad={() => {
                    console.log("Script carregado")
                    setTimeout(() => {
                        const count = document.getElementById("count").innerText
                        const errorThresh = document.getElementById("error").innerText
                        if(count == "0" || errorThresh == "NaN%") {
                            document.getElementById("loading").remove()
                            const error_msg = document.getElementById("load-error")
                            error_msg.querySelector("p").innerText = "O treinamento da inteligência artificial não está acontecendo corretamente. Isso pode ser um sinal de problema de compatibilidade com o seu dispositivo ):"
                            error_msg.hidden = false
                        }
                    }, 5000)

                    const options = {
                        iterations: 100000,
                        callback: logCallback,
                        errorThresh: 0.002,
                        learningRate: 0.1
                    }
                    const neural = new brain.NeuralNetwork({
                        activation: 'tanh',
                        hiddenLayers: [14]
                    })
                    neural.trainAsync(train_data, options).then(() => {
                        setTimeout(() => {
                            document.getElementById("loading").style.textAlign = "center"
                            document.getElementById("loading").innerHTML = "A inteligência artificial está pronta! <br /> A carregar o jogo..."    
                        }, 1200)
                        initGame()
                        setTimeout(() => {
                            document.getElementById("loading").remove()
                            document.getElementById("game").hidden = false
                        }, 3000)
                    }).catch(e => {
                        console.log(e)
                        document.getElementById("loading").remove()
                        document.getElementById("load-error").hidden = false
                    })

                    function logCallback(data) {
                        const count = document.getElementById("count")
                        const error = document.getElementById("error")
                        if(count) {
                            count.innerText = data.iterations
                        }
                        if(error) {
                            error.innerText = (data.error * 100).toFixed(2) + "%"
                        }
                    }

                    function initGame() {
                        const actions_translate = {
                            shot: 1,
                            reload: 2,
                            defend: 3
                        } // traduzir as ações para números, assim a inteligência pode entender com mais facilidade

                        const player = {
                            munition: 0,
                            lastAction: null,
                            defend: false
                        }
                        const IA = {
                            munition: 0,
                            lastAction: null,
                            defend: false
                        }

                        let STOP = false

                        console.log("Iniciando jogo")
                        const reload = document.getElementById("reload")
                        const shot = document.getElementById("shot")
                        const defend = document.getElementById("defend")

                        reload.onclick = () => {
                            if(STOP) return;
                            player.munition += 1
                            player.lastAction = "reload"
                            player.defend = false
                            changeStatus(false, player)
                            disable("reload")
                            log("Você recarregou")
                            log("<i>A IA está tomando uma decisão...</i>")
                            setTimeout(() => {
                                IAPlay();
                                enable()
                            }, 1000)
                        }

                        shot.onclick = () => {
                            if(STOP) return;
                            player.lastAction = "shot"
                            player.defend = false
                            changeStatus(false, player)
                            if(player.munition < 1) {
                                log("Você tentou atirar, mas não tinha munição!")
                                return IAPlay()
                            }
                            player.munition -= 1
                            disable("shot")
                            const isDefended = IAPlay(true) == "defend" ? true : false // A IA defendeu?
                            if(isDefended) {
                                log("Você atirou, porém a inteligencia artificial defendeu")
                                enable()
                            } else {
                                log("Você atirou e matou a inteligência artificial")
                                stopGame(true)
                                return
                            }
                        }

                        defend.onclick = () => {
                            if(STOP) return;
                            if(player.defend) {
                                return log("<strong>Você não pode se defender duas vezes seguidas!</strong>")
                            }
                            changeStatus(false, player)
                            player.lastAction = "defend"
                            player.defend = true
                            disable("defend")
                            log("Você defendeu")
                            log("<i>A IA está tomando uma decisão...</i>")
                            setTimeout(() => {
                                IAPlay();
                                enable()
                            }, 1000)
                        }

                        function disable() {
                            document.querySelectorAll("button").forEach(button => {
                                if(button.id == "reload-game") return;
                                button.disabled = true
                                button.style.opacity = 0.5
                            })
                        }

                        function enable() {
                            document.querySelectorAll("button").forEach(button => {
                                if(button.id == "reload-game") return;
                                button.disabled = false
                                button.style.opacity = 1
                            })
                        }

                        function log(text) {
                            const log = document.createElement("p")
                            log.innerHTML = text
                            document.getElementById("events").appendChild(log)
                        }

                        function IAPlay(shotCheck) {
                            document.getElementById("ia-probs").hidden = false
                            const munition = IA.munition
                            const lastAction = actions_translate[IA.lastAction] || 0
                            const playerMunition = player.munition
                            const playerLastAction = actions_translate[player.lastAction] || 0
                            
                            const data = [munition, lastAction, playerMunition, playerLastAction]
                            const action = neural.run(data)
                            const action_keys = Object.keys(action)
                            const action_array = action_keys.map(key => {
                                return {
                                    label: key,
                                    value: action[key]
                                }
                            })
                            action_array.sort((a, b) => b.value - a.value)
                            const better_decision = Object.keys(action).reduce((a, b) => action[a] > action[b] ? a : b)
                            if(better_decision == "shot") {
                                IA.lastAction = "shot"
                                if(IA.munition < 1) {
                                    return log("A inteligência artificial tentou atirar, mas não tinha munição!")
                                }
                                IA.munition -= 1
                                IA.defend = false
                                if(shotCheck) {
                                    return
                                } 
                                if(player.defend) {
                                    log("A inteligência artificial atirou, mas você defendeu")
                                } else {
                                    log("A inteligência artificial atirou e matou-o")
                                    disable("shot")
                                    stopGame()
                                }
                            } else if(better_decision == "reload") {
                                IA.lastAction = "reload"
                                IA.munition += 1
                                IA.defend = false
                                log("A inteligência artificial recarregou")
                            } else if(better_decision == "defend") {
                                IA.lastAction = "defend"
                                IA.defend = true
                                log("A inteligência artificial se defendeu")
                            }
                            changeStatus(true, IA)
                            const probs = document.getElementById("probs")
                            probs.innerHTML = ""
                            for(const act of action_array) {
                                const list = document.createElement("li")
                                list.innerText = `${act.label} - ${act.value}`
                                probs.appendChild(list)
                            }

                            return better_decision
                        }

                        function stopGame(win) {
                            STOP = true
                            const reloadbtn = document.getElementById("reload-game")
                            reloadbtn.hidden = false
                            reloadbtn.onclick = () => {
                                location.reload()
                            }
                            if(win) {
                                log("<strong>Você venceu a partida! Clique no botão para jogar denovo</strong>")
                            } else {
                                log("<strong>Você perdeu a partida! Clique no botão para jogar denovo</strong>")
                            }
                            disable("shot")
                        }

                        function changeStatus(isIa, player_data) {
                            const munition = isIa ? document.getElementById("munition-ia") : document.getElementById("munition")
                            const lastAction = isIa ? document.getElementById("last-action-ia") : document.getElementById("last-action")
                            const defend = isIa ? document.getElementById("defend-ia") : document.getElementById("defend-p")
                            munition.innerHTML = player_data.munition
                            lastAction.innerHTML = player_data.lastAction
                            defend.innerHTML = player_data.defend ? "Sim" : "Não"
                        }
                    }
                }}
            />
            <header>
                <h1>Você está preparado?</h1>
                <p>Agora você vai enfrentar a inteligência artificial.</p>
            </header>
            <main>
                <div id="loading">
                    <h2>Carregando...</h2>
                    <p>Aguarde enquanto a inteligência artificial é treinada.</p>
                    <p>Essa operação é um pouco custosa, as vezes pode demorar um pouco.</p>
                    <p>Se você notar que a taxa de erro travou, ou está começando aumentar ao invés de diminuir, recarregue a página.</p>
                    <p>Status do treinamento:</p>
                    <ul>
                        <li>Número de testes: <span id="count">0</span></li>
                        <li>Taxa de erro: <span id="error"></span></li>
                    </ul>
                </div>

                <div id="load-error" hidden>
                    <h2>Aconteceu um erro..</h2>
                    <p>Não foi possível treinar a inteligência artificial devido a um erro.</p>
                    <p>Por favor, tente recarregar a página</p>
                </div>

                <div id="game" hidden>
                    <h2>Vamos jogar!</h2>
                    <p>Escolha uma das opções abaixo para começar:</p>
                    <div className="options">
                        <button id="shot">Atirar</button>
                        <button id="defend">Defender</button>
                        <button id="reload">Recarregar</button>
                    </div>
                    <br />
                    <h3>Acontecimentos do jogo:</h3>
                    <div id="events" />
                    <h3>Informações suas</h3>
                    <p>Munição: <span id="munition">0</span></p>
                    <p>Última ação: <span id="last-action">Nenhuma</span></p>
                    <p>Defendeu: <span id="defend-p">Não</span></p>
                    <br />
                    <h3>Informações da IA</h3>
                    <p>Munição: <span id="munition-ia">0</span></p>
                    <p>Última ação: <span id="last-action-ia">Nenhuma</span></p>
                    <p>Defendeu: <span id="defend-ia">Não</span></p>
                    <h4 id="ia-probs" hidden>Decisões da IA</h4>
                    <ul id="probs"/>
                    <br />
                </div>
                <button id="reload-game" hidden style={{ margin: "auto" }}>jogar denovo</button>
            </main>
        </>
    )
}

export default playGame;