document.addEventListener('DOMContentLoaded', function () {
    let possuiErros;
    let editando = false;

    montarTabelaPrestadores();

    document.querySelectorAll('input[name="regiao"]').forEach(elemento => {
        elemento.addEventListener('change', configurarAtividades);
    });

    document.getElementById('centro').addEventListener('change', configurarAtividades);

    const formulario = document.getElementById('formulario');
    formulario.addEventListener('submit', function (event) {
        possuiErros = false;

        // Resetar estilos (remover bordas vermelhas)
        resetarEstilos();

        // Validar campo Nome
        const nome = document.getElementById('nome');
        if (!nome.value) {
            mostrarErro(nome, 'O nome deve estar preenchido.');
            possuiErros = true;
        } else if (nome.value.length < 3) {
            mostrarErro(nome, 'O nome deve ter pelo menos 3 caracteres.');
            possuiErros = true;
        }

        // Validar campo Sobrenome
        const sobrenome = document.getElementById('sobrenome');
        if (!sobrenome.value) {
            mostrarErro(sobrenome, 'O sobrenome deve estar preenchido.');
            possuiErros = true;
        }

        // Validar campo E-mail
        const email = document.getElementById('email');
        if (!email.value) {
            mostrarErro(email, 'O email deve estar preenchido.');
            possuiErros = true;
        } else if (!validarEmail(email.value)) {
            mostrarErro(email, 'E-mail inválido.');
            possuiErros = true;
        }

        // Validar campo Website (se preenchido)
        const website = document.getElementById('website');
        if (website.value && (!validarWebsite(website.value))) {
            mostrarErro(website, 'Website inválido');
            possuiErros = true;
        }

        // Validar campo de Data
        const dataini = document.getElementById('dataini');
        const datafim = document.getElementById('datafim');
        if (!dataini.value || !datafim.value) {
            if (!dataini.value) {
                mostrarErro(dataini, 'A Data Inicial deve estar preenchida e a data inicial deve ser posterior à data atual.');
            }
            if (!datafim.value) {
                mostrarErro(datafim, 'A Data Final deve estar preenchida.');
            }
            possuiErros = true;
        } else if (datafim.value <= dataini.value) {
            mostrarErro(dataini, 'Data inicial deve ser anterior à data final.');
            mostrarErro(datafim, 'Data final deve ser posterior à data inicial.');
            possuiErros = true;
        }

        // Validar Atividades pretendidas
        const atividades = document.querySelectorAll('input[name="atividade"]:checked');
        const atividadesDiv = document.getElementById('atividades');
        if (atividades.length < 1 || atividades.length > 3) {
            mostrarErro(atividadesDiv, 'Selecione de 1 a 3 atividades');
            possuiErros = true;
        }

        // Validar Região
        const regiao = document.querySelector('input[name="regiao"]:checked');
        const regiaoDiv = document.getElementById('regiao');
        if (!regiao) {
            mostrarErro(regiaoDiv, 'Selecione uma região.');
            possuiErros = true;
        }

        if (possuiErros == true) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Verificar se está editando ou criando
        if (editando) {
            const id = document.querySelector('#titulo').getAttribute('data-id');
            const prestadoresDeServico = JSON
                .parse(localStorage.getItem('prestadoresDeServico')) ?? []

            prestadoresDeServico[id] = {
                nome: document.querySelector('#nome').value,
                sobrenome: document.querySelector('#sobrenome').value,
                email: document.querySelector('#email').value,
                site: document.querySelector('#website').value,
                dataInicial: document.querySelector('#dataini').value,
                dataFinal: document.querySelector('#datafim').value,
                regiao: document.querySelector('input[name=regiao]:checked').value,
                atividadesPretendidas: Array.from(document.querySelectorAll('input[name=atividade]:checked')).map(a => a.value)
            };

            localStorage
                .setItem(
                    'prestadoresDeServico',
                    JSON.stringify(prestadoresDeServico)
                );

            editando = false;
            document.querySelector('#titulo').style.display = 'none';
            document.querySelector('#titulo').removeAttribute('data-id');
        } else {
            const prestadorServico = {
                nome: document.querySelector('#nome').value,
                sobrenome: document.querySelector('#sobrenome').value,
                email: document.querySelector('#email').value,
                site: document.querySelector('#website').value,
                dataInicial: document.querySelector('#dataini').value,
                dataFinal: document.querySelector('#datafim').value,
                regiao: document.querySelector('input[name=regiao]:checked').value,
                atividadesPretendidas: Array.from(document.querySelectorAll('input[name=atividade]:checked')).map(a => a.value)
            };

            const prestadoresDeServico = JSON
                .parse(localStorage.getItem('prestadoresDeServico')) ?? []

            prestadoresDeServico.push(prestadorServico);

            localStorage
                .setItem(
                    'prestadoresDeServico',
                    JSON.stringify(prestadoresDeServico)
                );

            montarTabelaPrestadores();
        }
    });

    // Função para resetar estilos
    function resetarEstilos() {
        const campos = document.querySelectorAll('.campo input');
        campos.forEach(function (campo) {
            campo.style.border = '1px solid #8a8a8a';
        });

        document.getElementById('regiao').style.border = '1px solid #8a8a8a';
        document.getElementById('atividades').style.border = '1px solid #8a8a8a';

        // Remove todas as mensagens de erro
        const mensagensErro = document.querySelectorAll('.mensagem-erro');
        mensagensErro.forEach(function (mensagemErro) {
            mensagemErro.remove();
        });
    }

    // Função para mostrar mensagens de erro
    function mostrarErro(elemento, mensagem) {

        // Crie uma nova mensagem de erro
        const mensagemErro = document.createElement('div');
        mensagemErro.className = 'mensagem-erro';
        mensagemErro.textContent = mensagem;

        mensagemErro.style.color = 'red';
        elemento.style.border = '2px solid red';

        // Adicione a mensagem de erro ao elemento pai do campo
        elemento.parentNode.appendChild(mensagemErro);
    }

    // Função para configurar atividades
    function configurarAtividades(evento) {
        const dba = document.getElementById('dba');
        const programador = document.getElementById('programador');
        if (evento.target.value == 'centro-oeste') {
            dba.disabled = true;
            dba.checked = false;
            programador.disabled = true;
            programador.checked = false;
        } else {
            dba.disabled = false;
            programador.disabled = false;
        }
    }

    // Validar email
    function validarEmail(email) {
        return email.includes('@') && email.includes('.');
    }

    // Validar website
    function validarWebsite(website) {
        return website.startsWith('http://') || website.startsWith('https://');
    }

    // Botão Reiniciar
    formulario.addEventListener('reset', resetarEstilos);

    function montarTabelaPrestadores() {
        const prestadoresDeServico = JSON
            .parse(localStorage.getItem('prestadoresDeServico')) ?? []


        const tabela = document.querySelector('#tabela-prestadores tbody');
        tabela.innerHTML = '';

        let conteudo = '';

        prestadoresDeServico.forEach((prestador, indice) => {
            conteudo += `
                    <tr>
                        <td>${indice}</td>
                        <td>${prestador.nome}</td>	
                        <td>${prestador.sobrenome}</td>
                        <td>${prestador.email}</td>
                        <td>${prestador.site}</td>
                        <td>${prestador.dataInicial}</td>
                        <td>${prestador.dataFinal}</td>
                        <td>${prestador.regiao}</td>
                        <td>${prestador.atividadesPretendidas.join(' - ')}</td>
                        <td>
                            <button class='edicao' data-id='${indice}'>Editar</button>
                            <button class='exclusao' data-id='${indice}'>Excluir</button>
                        </td>
                    </tr>
            `;
        });
        tabela.innerHTML = conteudo;
    }

    //Excluir e Editar Prestador
    const tabela = document.querySelector('#tabela-prestadores tbody');
    tabela.addEventListener('click', function (event) {
        const target = event.target;
        if (target.className === 'exclusao') {
            const id = target.getAttribute('data-id');
            excluirPrestador(id);
        } else if (target.className === 'edicao') {
            const id = target.getAttribute('data-id');
            editarPrestador(id);
        }
    });

    function excluirPrestador(id) {
        const prestadoresDeServico = JSON
            .parse(localStorage.getItem('prestadoresDeServico')) ?? []

        prestadoresDeServico.splice(id, 1);

        localStorage
            .setItem(
                'prestadoresDeServico',
                JSON.stringify(prestadoresDeServico)
            );

        montarTabelaPrestadores();
    }

    function editarPrestador(id) {
        const prestadoresDeServico = JSON
            .parse(localStorage.getItem('prestadoresDeServico')) ?? []

        const prestador = prestadoresDeServico[id];

        const titulo = document.querySelector('#titulo');

        titulo.style.display = 'block';
        titulo.textContent = `Editando Prestador ${id}`;
        titulo.setAttribute('data-id', id);

        definirValoresCampo('#nome', prestador.nome);
        definirValoresCampo('#sobrenome', prestador.sobrenome);
        definirValoresCampo('#email', prestador.email);
        definirValoresCampo('#website', prestador.site);
        definirValoresCampo('#dataini', prestador.dataInicial);
        definirValoresCampo('#datafim', prestador.dataFinal);
        document.querySelector(`input[value="${prestador.regiao}"]`).checked = true;

        document.querySelectorAll('input[name="atividade"]').forEach(atividade => {
            atividade.checked = false;
        });

        prestador.atividadesPretendidas.forEach(atividade => {
            definirValoresCampo(`input[value="${atividade}"]`, true);
        });

        editando = true;
    }

    // Função para definir os valores dos campos
    function definirValoresCampo(selector, value) {
        const field = document.querySelector(selector);
        if (field) {
            field.value = value;
        }
    }
});