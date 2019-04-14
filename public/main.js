const socketFun = (() => {
    // make socket connection
    let socket = io.connect('http://localhost:5000');
    return {
        getSocket: () => { return socket }
    }
})();

socketFun.getSocket().on('newDonation', newDonation => {
    console.log(newDonation);
    updateDom(newDonation.amount);
});

let getAmountFromFormattedString = (text) => {
    if(text[0] == '$')
        text = text.substring(1);
    text = text.split(',').join('');
    return text;
}

let convertStringToNumber = (text) => {
    if (Number(text) == NaN)
        return 0;
    else
        return Number(text);
}

let updateDom = (amount) => {
    let totalAmount = document.getElementById('totalAmount');
    if (totalAmount){
        //let prevAmount = getAmountFromFormattedString(totalAmount.innerHTML);
        //let sum = convertStringToNumber(prevAmount) + convertStringToNumber(amount);
        //sum = convertStringToNumber(amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
        totalAmount.innerHTML = convertStringToNumber(amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' });;
    }
}

window.onload = () => {
    let submit = document.getElementById('submit');

    if (submit) {
        // donate submit
        submit.addEventListener('click', () => {
            let amount = convertStringToNumber(document.getElementById('amount').value);
            let donation = {
                amount: amount < 0 ? 0 : amount
            }
            socketFun.getSocket().emit('addDonation', donation);
        });
    }

};