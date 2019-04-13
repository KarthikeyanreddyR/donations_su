const socketFun = (() => {
    // make socket connection
    let socket = io.connect('http://localhost:5000');
    return {
        getSocket: () => { return socket }
    }
})();

socketFun.getSocket().on('newDonation', newDonation => {
    console.log(newDonation);
    let totalAmount = document.getElementById('totalAmount');
    if (totalAmount)
        totalAmount.innerHTML = convertStringToNumber(totalAmount.innerHTML) + convertStringToNumber(newDonation.amount);
});

let convertStringToNumber = (text) => {
    if (Number(text) == NaN)
        return 0;
    else
        return Number(text);
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