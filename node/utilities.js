module.exports = {
    isTrade (historyItem) {
        if (historyItem.type && historyItem.type !== 'TRADE') {
            return false;
        } else {
            return true;
        }
    }
}