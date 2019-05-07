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
    if (command == 'TimeLockToAsset'){
        return 'Time Lock To Asset';
    }
    if (command == 'TimeLockToTimeLock'){
        return 'Time Lock To Time Lock';
    }
    if(command == 'AssetToTimeLock'){
        return 'Asset To Time Lock'
    }
};
