new Vue({
    el: "#app",
    data: {
        page: "main",
        settings: {
            "accounts": [
                {
                    "id": 0,
                    "login": "admin",
                    "password": "admin",
                    "name": "Администратор",
                    "admin": 2
                },
                {
                    "id": 1,
                    "login": "admin1",
                    "password": "admin1",
                    "name": "Кассир 1",
                    "admin": 0
                }
            ],
            "settings": [
                {
                    "marketName": "CloudCore"
                }
            ],
            "items": [
                {
                    "id": 0,
                    "name": "Товар 1",
                    "price": 100,
                    "count": 1,
                    "barcode": "1234567890129",
                },
                {
                    "id": 1,
                    "name": "Товар 2",
                    "price": 100,
                    "count": 1,
                    "barcode": "1234015678929",
                },
                {
                    "id": 2,
                    "name": "Товар 3",
                    "price": 100,
                    "count": 1,
                    "barcode": "1678234590129",
                },
                {
                    "id": 3,
                    "name": "Товар 4",
                    "price": 100,
                    "count": 1,
                    "barcode": "1230129456789",
                },
                {
                    "id": 4,
                    "name": "Товар 5",
                    "price": 100,
                    "count": 1,
                    "barcode": "1234689507129",
                },
            ],
            "shifts": [
                {
                    "id": 0,
                    "dateOpen": "1",
                    "dateClose": "1",
                    "employee": 1,
                    "isOpen": false,
                    "sales": 1,
                    "generalReceipt": 100
                },
                {
                    "id": 1,
                    "dateOpen": "1",
                    "dateClose": "1",
                    "employee": 1,
                    "isOpen": true,
                    "sales": 1,
                    "generalReceipt": 100
                },
            ],
            "receipts": [
                {
                    "id": 0,
                    "shifId": 0,
                    "total": 100,
                    "date": "1",
                    "employee": 1,
                    "items": [0, 1, 2, 3, 4],
                    "buyerId": 1,
                    "discount": 0,
                    "toPaid": 100,
                    "payment": 0
                }
            ],
            "buyers": [
                {
                    "id": 0,
                    "buys": 1,
                    "name": "Виталий Пупков",
                    "numberPhone": "+7 995 583-06-36",
                    "bonuses": 100
                }
            ]
        },
        user: {
            "id": 0,
            "login": "admin",
            "password": "admin",
            "name": "Администратор",
            admin: 2
        },
        shiftInfo: {},
        search: {
            allItems: ''
        },
        isEditing: false,
        editingItem: {},
        dialog: {
            page: '',
            info: []
        }
    },
    methods: {
        async loadSettings() {
            this.settings = await window.electronAPI.getSettings();
        },
        checkShift() {
            let shift = this.settings.shifts.find(i => i.isOpen === true)
            if (shift) {
                this.shiftInfo = shift
                return `Открыта с ${shift.dateOpen}`;
            } else {
                return "Закрыта"
            }
        },
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(price);
        },
        editItem(item) {
            this.isEditing = true;
            this.editingItem = { ...item };
        },
        saveItem() {
            const index = this.settings.items.findIndex(item => item.id === this.editingItem.id);
            if (index !== -1) {
                this.settings.items[index] = { ...this.editingItem };
                this.cancelEdit();
            }
        },
        cancelEdit() {
            this.isEditing = false;
            this.editingItem = {};
        },
        generateBarcodes() {
            this.settings['items'].forEach(item => {
                const el = document.querySelector("#barcode" + item.id);
                if (el) {
                    JsBarcode(el, item.barcode, {
                        format: "CODE128",
                        displayValue: true,
                        height: 100
                    });
                }
            });
        },        
        focus(element) {
            setTimeout(() => {
                document.getElementById(element).focus();
            }, 300);
        },
        getItem(id) {
            return this.settings['items'].find(i => i.id === id);
        },
        dialogWindow(page, info) {
            this.dialog.page = page
            this.dialog.info = info
        }
    },
    mounted() {
        setInterval(() => {
            this.generateBarcodes();  
        }, 100);
        setInterval(() => {
            if(this.page === 'searchAllItems') {
                this.focus('searchAllItems')
            }  
        }, 100);
        this.user = JSON.parse(sessionStorage.getItem("user")) || {};
        this.loadSettings();
    }
});