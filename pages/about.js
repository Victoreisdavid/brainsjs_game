import Head from "next/head"

function aboutPage() {
    return (
        <>
            <Head>
                <title>Sobre mim (desenvolvedor)</title>
            </Head>
            <header>
                <h1>Olá!</h1>
                <p>Aparentemente você está curioso</p>
            </header>
            <main>
                <h2>Porque "jogo"?</h2>
                <p>Eu não acho que isso seja um jogo de fato, é apenas um projeto que eu fiz por diversão, não tem o objetivo de ser sério nem nada.</p>
                <p>O código feito não é das melhores coisas, principalmente a inteligência artificial, que usa uma biblioteca um pouco limitada, e métodos de treinamento não tão eficientes.</p>
                <p>Eu não sou estudande de machine learning, muito menos profissional, então não espere muito disso aqui, eu fiz mais por diversão mesmo..</p>
                <h2>Um pouco sobre mim (desenvolvedor)</h2>
                <p>Eu me chamo <strong>Victor Reis David</strong>, tenho 15 anos e moro em curitiba</p>
                <p>Se você quiser, pode visitar meu <a href="https://github.com/victoreisdavid" target="_blank">perfil do github</a>, inclusive esse jogo é open source, e você encontra todo o código fonte lá.</p>
                <h3>Lista de objetivos:</h3>
                <ul>
                    <li>Aprender a programar em rust</li>
                    <li>Aprender a programar em java</li>
                    <li>Aprender docker e docker-compose</li>
                    <li>Aprender kubernetes</li>
                    <li>Muitas outras coisas que eu tenho preguiça de colocar</li>
                </ul>
            </main>
        </>
    )
}

export default aboutPage;