import Head from "next/head"

function indexPage() {
    return (
        <>
            <Head>
                <title>Bem vindo</title>
            </Head>
            <header>
                <h1>Brainjs game</h1>
                <p>Será que você consegue derrotar a IA ?</p>
            </header>
            <main>
                <h2>Como funciona o jogo?</h2>
                <p>Basicamente, você tem 3 ações:</p>
                <ul>
                    <li>Atirar</li>
                    <li>Defender</li>
                    <li>Recarregar</li>
                </ul>
                <p>Você deve usar as ações da forma certa, para não perder o jogo.</p>
                <p>Se você conseguir atirar no seu oponente, sem que ele defenda, você consegue ganhar o jogo, caso contrário, se ele atirar em você, você perde.</p>
                <p>Algumas regras aqui:</p>
                <ul>
                    <li>Você só pode atirar se tiver munição (meio óbvio kk)</li>
                    <li>Você não pode se defender duas vezes seguidas</li>
                </ul>
                <div id="buttons" style={{ width: "fit-content", margin: "auto" }}>
                    <button onClick={(d) => { d.view.document.location.href = "/about" }}>Sobre o "jogo"</button>
                    <button onClick={(d) => { d.view.document.location.href = "/play" }}>Jogar o "jogo"</button>
                </div>
            </main>
        </>
    )
}

export default indexPage;