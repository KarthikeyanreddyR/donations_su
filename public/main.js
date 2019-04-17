const socketFun = (() => {
    // make socket connection
    console.log(location.origin);
    let socket = io.connect(location.origin);
    return {
        getSocket: () => { return socket }
    }
})();

socketFun.getSocket().on('newDonation', newDonation => {
    console.log(newDonation);
    updateDom(newDonation.amount);
});

let getAmountFromFormattedString = (text) => {
    if (text[0] == '$')
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
    if (totalAmount) {
        //let prevAmount = getAmountFromFormattedString(totalAmount.innerHTML);
        //let sum = convertStringToNumber(prevAmount) + convertStringToNumber(amount);
        //sum = convertStringToNumber(amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
        totalAmount.innerHTML = convertStringToNumber(amount).toLocaleString(undefined, { style: 'currency', currency: 'USD' });;
    }
}

window.onload = () => {
    let submit = document.getElementById('submit');
    let reset = document.getElementById('reset');
    let modal = document.getElementsByClassName('modal')[0];
    let close = document.getElementById('close');
    let erase = document.getElementById('erase');

    if (submit) {
        // donate submit
        submit.addEventListener('click', () => {
            let amount = convertStringToNumber(document.getElementById('amount').value);
            console.log(amount)
            let donation = {
                amount: amount < 0 ? 0 : amount
            }
            socketFun.getSocket().emit('addDonation', donation);
        });
    }

    if (reset) {
        reset.addEventListener('click', () => {
            openModal();
        });
    }

    if (close) {
        close.addEventListener('click', () => {
            closeModal();
        });
    }

    if (erase) {
        erase.addEventListener('click', () => {
            console.log('erase');
            let donation = {
                amount: -1
            }
            socketFun.getSocket().emit('addDonation', donation);
            setTimeout(() => { closeModal() }, 10);
        });
    }

    let openModal = () => {
        modal.className += " is-active";
    }

    let closeModal = () => {
        modal.classList.remove("is-active");
    }

};