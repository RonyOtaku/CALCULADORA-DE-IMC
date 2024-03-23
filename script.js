async function searchCrypto() {
    const apiKey = '04f19d41-6e31-4850-88c4-c721cf420aa8'

    const cryptoName = document.getElementById('searchInput')
    const precoInput = document.getElementById('precoImput')
    const totalCirculanteInput = document.getElementById('totalCirculanteInput')
    const capMercadoInput = document.getElementById('capMercadoInput')
    const calcNewPreco = document.getElementById('novoPreçoInput')
    const novaCapMercado = document.getElementById('novaCapMercadoInput')
    
    try {
        const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?&convert=USD&symbol=${cryptoName.value}&CMC_PRO_API_KEY=${apiKey}`)
        const { data }  = await response.json();
        const cryptoInfo = Object.values(data)[0];
        precoInput.value = cryptoInfo.quote.USD.price.toFixed(2);
        totalCirculanteInput.value = cryptoInfo.total_supply || 'N/A';
        capMercadoInput.value = cryptoInfo.quote.USD.market_cap || 'N/A';
    } catch (error) {
        cryptoName.value = '';
        precoInput.value = '';
        totalCirculanteInput.value = '';
        capMercadoInput.value = '';
        calcNewPreco.value = '';
        novaCapMercado.value = '';
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
