exports.returnCommand = function (command) {
    if (command == 'GenNotationFunc') {
        return 'Generate SAN';
    }
    if (command == 'GenAssetFunc') {
        return 'Create Asset';
    }
    if (command == 'SendAssetFunc') {
        return 'Send Asset';
    }
    if (command == 'TimeLockFunc') {
        return 'Time Lock';
    }
    if (command == 'BuyTicketFunc') {
        return 'Buy Ticket';
    }
    if (command == 'AssetValueChangeFunc') {
        return 'Asset Supply Change';
    }
    if (command == 'MakeSwapFunc') {
        return 'Make Swap';
    }
    if (command == 'RecallSwapFunc') {
        return 'Recall Swap';
    }
    if (command == 'TakeSwapFunc') {
        return 'Take Swap';
    }
};
