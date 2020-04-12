function generateChargeStrings(transactions) {
    return transactions
        .filter(t => !t.hidden)    
        .map(t => {
            return `${t.name} ${t.date} ${t.amount}/${t.divisor}`;
        });
}

export {
    generateChargeStrings
};