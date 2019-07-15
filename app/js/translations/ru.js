'use strict';
var gb = function () {
}
gb.data = {

    // PLEASE MAKE USE OF SAME CAPITALIZATION

    // NAVBAR

    NAVBAR_NETWORKS: 'Сеть',
    NAVBAR_DASHBOARD: 'Основное',
    NAVBAR_BLOCKS: 'Блоки',
    NAVBAR_TRANSACTIONS: 'Транзакции',
    NAVBAR_ASSETS: 'Активы',
    NAVBAR_ADDRESSES: 'Кошельки',
    NAVBAR_STAKING: 'Стейкинг',
    NAVBAR_SEARCH: 'Поиск по Кошельку / TxHash / Блоку',
    NAVBAR_SELECT_LANGUAGE: 'Выберите Язык',

    // DASHBOARD PAGE

    DASHBOARD_LOADING: 'Загрузка',
    DASHBOARD_PRICE: 'Цена',
    DASHBOARD_MARKETCAP: 'Рыночная Капитализация',
    DASHBOARD_BLOCKHEIGHT: 'Номер Блока',
    DASHBOARD_TRANSACTIONS: 'Транзакции',
    DASHBOARD_ASSETS: 'Активы',
    DASHBOARD_TICKETS: 'Билеты',
    DASHBOARD_LATESTBLOCKS: 'Последние Блоки',
    DASHBOARD_VIEWALL: 'Подробнее',
    DASHBOARD_MINEDBY: 'Кем Смайнен',
    DASHBOARD_LATESTTRANSACTIONS: 'Последние Транзакции',

    // BLOCKS PAGE

    BLOCKS_BLOCKS: 'Блоки',
    BLOCKS_GOTOBLOCK: 'Перейти к Блоку',
    BLOCKS_ROWS: 'Строки',
    BLOCKS_OF: 'из',
    BLOCKS_BLOCK: 'Блок',
    BLOCKS_AGE: 'Возраст',
    BLOCKS_TRANSACTIONS: 'Транзакций',
    BLOCKS_MINER: 'Майнер',
    BLOCKS_GAS_USED: 'Использованный Газ',
    BLOCKS_GAS_LIMIT: 'Лимит Газа',
    BLOCKS_REWARD: 'Награда',

    // BLOCK PAGE

    BLOCK_BLOCKHEIGHT: 'Номер Блока',
    BLOCK_TRANSACTIONS: 'Транзакций',
    BLOCK_AGE: 'Время Создания',
    BLOCK_REWARD: 'Награда',
    BLOCK_HASH: 'Хэш',
    BLOCK_PARENTHASH: 'Родительский Хэш',
    BLOCK_MINER: 'Майнер',
    BLOCK_DIFFICULTY: 'Сложность',
    BLOCK_TOTAL_DIFFICULTY: 'Общая Сложность',
    BLOCK_SIZE: 'Размер',
    BLOCK_GAS_USED: 'Потрачено Газа',
    BLOCK_GAS_LIMIT: 'Лимит Газа',
    BLOCK_TRANSACTION_HASH: 'Хэш Транзакции',
    BLOCK_BLOCK: 'Блок',
    BLOCK_TYPE: 'Тип',
    BLOCK_NONCE: 'Очередь',
    BLOCK_ASSETS: 'Активы',
    BLOCK_FEES: 'Комиссия',

    // TRANSACTIONS PAGE

    TRANSACTIONS_TRANSACTIONS: 'Транзакции',
    TRANSACTIONS_GO_TO_TRANSACTION: 'К Транзакции',
    TRANSACTIONS_ROWS: 'Строки',
    TRANSACTIONS_OF: 'из',
    TRANSACTIONS_TRANSACTION_HASH: 'Хэш Транзакции',
    TRANSACTIONS_BLOCK: 'Блок',
    TRANSACTIONS_AGE: 'Возраст',
    TRANSACTIONS_TYPE: 'Тип',
    TRANSACTIONS_FEES: 'Комиссия',

    // TRANSACTION PAGE

    TRANSACTION_NOT_EMITTED_MESSAGE: 'Эта транзакция не была обработана или передана в блокчейн',
    TRANSACTION_RETRYING_IN: 'Повторная Попытка через',
    TRANSACTION_SECONDS: 'секунды',
    TRANSACTION_TRANSACTION: 'Транзакция',
    TRANSACTION_TIME_LOCK: 'Временная Блокировка',
    TRANSACTION_SWAP_DETAILS: 'Детали Свапа',
    TRANSACTION_FROM: 'Отправитель:',
    TRANSACTION_TO: 'Получатель:',
    TRANSACTION_ASSET: 'Актив:',
    TRANSACTION_STATUS: 'Статус',
    TRANSACTION_TRANSACTION_TYPE: 'Тип Транзакции',
    TRANSACTION_TRANSACTION_HASH: 'Хэш Транзакции',
    TRANSACTION_BLOCK: 'Блок',
    TRANSACTION_AGE: 'Возраст',
    TRANSACTION_GAS_USED: 'Потрачено Газа',
    TRANSACTION_NONCE: 'Счетчик Транзакций',

    // ASSETS PAGE

    ASSETS_ASSETS: 'Активы',
    ASSETS_ASSET_ID: 'Идентификатор Актива',
    ASSETS_ASSET_NAME: 'Имя Актива',
    ASSETS_QUANTITY: 'Количество',
    ASSETS_OF: 'из',
    ASSETS_ROWS: 'Строки',
    ASSETS_SEARCH_ASSET: 'Найти актив',

    // ASSETS PAGE

    ASSET_ASSET: 'Актив',
    ASSET_ASSET_NAME: 'Имя Актива',
    ASSET_ASSET_SYMBOL: 'Символ Актива',
    ASSET_TYPE: 'Тип Актива',
    ASSET_ISSUED_ON_FUSION: 'Выпущено FUSION',
    ASSET_DECIMALS: 'Разрядность',
    ASSET_TOTAL_SUPPLY: 'Выпущено Всего',
    ASSET_ISSUER: 'Эмитент',
    ASSET_ISSUE_HEIGHT: 'Блок Выпуска',
    ASSET_CHANGEABLE_SUPPLY: 'Поддержка Обмена',
    ASSET_YES: 'Да',
    ASSET_NO: 'Нет',

    // STAKING PAGE

    STAKING_STAKING: 'Стейкинг',
    STAKING_LAST_UPDATED: 'Последнее Обновление',
    STAKING_STAKING_STATUS: 'Статус Стейкинга',
    STAKING_ACTIVE: 'Активно',
    STAKING_TICKETS: 'Билеты',
    STAKING_REWARDS_TO_DATE: 'Текущее Вознаграждение',
    STAKING_ADDRESS: 'Кошелёк',
    STAKING_WALLET_ADDRESS: 'Адрес Кошелька',
    STAKING_INPUT_FIELD: 'Ваш адрес кошелька начинается с 0x',
    STAKING_INFORMATION: 'Для отслеживания Вашей награды за стейкинг, пожалуйста, введите Ваш кошелёк. Вы можете вернуться на эту страницу в любой момент и возобновить отслеживание.',

    // FOOTER PAGE

    FOOTER_INFORMATION: 'FUSION Block Explorer - это инструмент, разработанный для отслеживания всех транзакций в блокчейне.',
    FOOTER_FUSION_TOOLS: 'Инструменты FUSION',
    FOOTER_MORE: 'Больше',
    FOOTER_FUSION_NETWORK: 'Сеть FUSION',
    FOOTER_FSN_TOKEN: 'FSN Токен',
    FOOTER_ABOUT_US: 'О Компании',
    FOOTER_SUPPORT: 'Поддержка',
    FOOTER_CONTACT: 'Контакты',
    FOOTER_FAQ: 'FAQ',
    FOOTER_SUBMIT_AN_ISSUE: 'Сообщить о Проблеме',
    FOOTER_ALL_RIGHTS_RESERVED: 'Все Права Защищены'
};

module.exports = gb.data;
