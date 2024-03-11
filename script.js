async function searchCrypto() {
    const cryptoName = document.getElementById('searchInput').value;
    const apiKey = '04f19d41-6e31-4850-88c4-c721cf420aa8';

    try {
        const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?&convert=USD&symbol=${cryptoName}&CMC_PRO_API_KEY=${apiKey});
        const data = await response.json();

        console.log('Resposta da API:', data);

        if (data.status.error_code === 0 && data.data && data.data.length > 0) {
            const cryptoInfo = data.data[0];

            // Atualize os valores conforme necessário
            const precoInput = document.getElementById('precoImput');
            precoInput.value = cryptoInfo.quote.USD.price.toFixed(2);

            const totalCirculanteInput = document.getElementById('totalCirculanteInput');
            totalCirculanteInput.value = cryptoInfo.total_supply || 'N/A';

            const capMercadoInput = document.getElementById('capMercadoInput');
            capMercadoInput.value = cryptoInfo.quote.USD.market_cap || 'N/A';
        } else {
            console.error('Erro na resposta da API:', data.status.error_message);
        }
    } catch (error) {
        console.error('Erro ao recuperar dados:', error);
    }
}

function formatNumber(number, maxFractionDigits) {
    const options = {
        minimumFractionDigits: 0,
        maximumFractionDigits: maxFractionDigits,
    };
    return new Intl.NumberFormat('en-US', options).format(number);
}

function parseFormattedNumber(value) {
    const cleanValue = value.replace(/[^\d.-]/g, '');
    return parseFloat(cleanValue) || 0;
}

function formatAndSetInputValue(inputId, number, maxFractionDigits) {
    const inputValue = document.getElementById(inputId);
    inputValue.value = formatNumber(number, maxFractionDigits);
}

function updateFormattedValue(inputId) {
    const inputValue = document.getElementById(inputId);
    const parsedValue = parseFormattedNumber(inputValue.value);
    formatAndSetInputValue(inputId, parsedValue, 30); // 30 é o número máximo de zeros após a vírgula
}

function calculate() {
    const percCrescimentoInput = document.getElementById('percCrescimentoInput');
    const totalCirculanteInput = document.getElementById('totalCirculanteInput');

    const capMercadoInput = parseFormattedNumber(document.getElementById('capMercadoInput').value) || 0;
    const totalCirculante = parseFormattedNumber(totalCirculanteInput.value) || 1;
    const percCrescimento = parseFormattedNumber(percCrescimentoInput.value) || 0;

    const novaCapMercado = capMercadoInput + (capMercadoInput * percCrescimento / 100);
    formatAndSetInputValue('novaCapMercadoInput', novaCapMercado.toFixed(2), 30);

    if (!isNaN(novaCapMercado) && !isNaN(totalCirculante)) {
        const resultadoCalculo = novaCapMercado / totalCirculante;
        formatAndSetInputValue('novoPreçoInput', resultadoCalculo, 30);
    } else {
        alert('Valores inválidos para o cálculo.');
    }
}

['capMercadoInput', 'totalCirculanteInput', 'percCrescimentoInput'].forEach(function(inputId) {
    document.getElementById(inputId).addEventListener('input', function() {
        updateFormattedValue(inputId);
    });

    document.getElementById(inputId).addEventListener('keydown', function(event) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
            updateFormattedValue(inputId);
        }
    });
});

document.getElementById('calculate').addEventListener('click', function() {
    calculate();
});
