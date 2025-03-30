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
                    "name": "Лирика",
                    "price": 100,
                    "count": 3,
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
                    "price": 1000,
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
                    "employee": 0,
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
                    "items": [
                        {
                            id: 0,
                            count: 1,
                        },
                        {
                            id: 1,
                            count: 1,
                        },
                        {
                            id: 2,
                            count: 1,
                        },
                        {
                            id: 3,
                            count: 1,
                        },
                        {
                            id: 4,
                            count: 1,
                        },
                    ],
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
                    "numberPhone": "79955830636",
                    "bonuses": 100,
                    "barcode": '4600000000000',
                    "discount": 5,
                    "totalAmount": 0
                },
                {
                    "id": 1,
                    "buys": 1,
                    "name": "Виталий Пупков",
                    "numberPhone": "79955830636",
                    "bonuses": 100,
                    "barcode": '4600000000001',
                    "discount": 5,
                    "totalAmount": 0
                },
                {
                    "id": 2,
                    "buys": 1,
                    "name": "Виталий Пупков",
                    "numberPhone": "79955830636",
                    "bonuses": 100,
                    "barcode": '4600000000002',
                    "discount": 5,
                    "totalAmount": 0
                },
            ]
        },
        user: {
            "id": 0,
            "login": "admin",
            "password": "admin",
            "name": "Администратор",
            "admin": 2
        },
        shiftInfo: {},
        search: {
            allItems: '',
            buyersName: '',
            buyersNumber: '',
        },
        isEditing: false,
        editingItem: {},
        dialog: {
            page: '',
            info: []
        },
        receipt: [],
        scannedText: '',
        discountCardInput: '',
        discount: 0,
        buyerId: -1,
        errorMsg: '',
        change: {
            input: 0,
        },
        addBuyer: {
            show: false,
            name: '',
            numberPhone: '',
            barcode: '',
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
        receiptCancel() {
            this.receipt = []
            this.discount = 0
            this.buyerId = -1
        },
        generatePrice(id) {
            let itemReceipt = this.receipt.find(i => i.id === id)
            let item = this.settings.items.find(i => i.id === itemReceipt.itemId)
            if (itemReceipt.count > item.count) {
                this.itemReceipt.count = item.count
            } else {
                itemReceipt.price = item.price * itemReceipt.count
            }
        },
        receiptTotal() {
            let total = 0
            this.receipt.forEach(element => {
                total = total + element.price
            });
            return total;
        },
        searchDiscount() {
            let buyer = this.settings.buyers.find(i => i.barcode === this.discountCardInput)
            if (buyer) {
                this.discount = buyer.discount
                this.buyerId = buyer.id
            } else {
                this.errorMsg = 'Покупатель не найден'
            }
            this.discountCardInput = ''
        },
        searchByBarcodeAndInsert(barcode) {
            this.errorMsg = ''
            if (this.scannedText === '' || this.scannedText.length != 13) return;
            let item = this.settings.items.find(i => i.barcode === barcode)

            if (item) {
                let findItemsReceipt = this.receipt.find(i => i.itemId === item.id)
                if (findItemsReceipt) {
                    if (findItemsReceipt.count + 1 > item.count) {
                        this.errorMsg = `Остаток товара - ${item.count}`
                    } else {
                        findItemsReceipt.count = findItemsReceipt.count + 1
                    }
                } else {
                    const newId = this.receipt.length > 0 ? Math.max(...this.receipt.map(i => i.id)) + 1 : 1;
                    this.receipt.push(
                        {
                            id: newId,
                            itemId: item.id,
                            name: item.name,
                            price: item.price,
                            count: 1,
                        }
                    )
                }
            } else {
                this.errorMsg = 'Товар не найден'
            }
            this.scannedText = ''
        },
        addItemToReceiptFromId(id) {
            let item = this.settings["items"].find(i => i.id === id)
            this.page = 'main'
            this.scannedText = item.barcode
            this.searchByBarcodeAndInsert(item.barcode)
        },
        deleteFromReceipt(id) {
            this.receipt = this.receipt.filter(i => i.id !== id);
        },
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(price);
        },
        editItem(item) {
            this.isEditing = true;
            this.editingItem = { ...item };
        },
        saveItem(item) {
            if('buyersAdd') {
                this.settings['buyers'].push(
                    {
                        "id": this.settings['buyers'].length,
                        "buys": 0,
                        "name": this.addBuyer.name,
                        "numberPhone": this.addBuyer.numberPhone,
                        "bonuses": 0,
                        "barcode": this.addBuyer.barcode,
                        "discount": 5,
                        "totalAmount": 0
                    },
                )
                this.addBuyer.show = false
            }
            else if (item === 'buyers') {
                const index = this.settings.buyers.findIndex(item => item.id === this.editingItem.id);
                if (index !== -1) {
                    this.settings.buyers[index] = { ...this.editingItem };
                    this.cancelEdit();
                }
            } else {
                const index = this.settings.items.findIndex(item => item.id === this.editingItem.id);
                if (index !== -1) {
                    this.settings.items[index] = { ...this.editingItem };
                    this.cancelEdit();
                }
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
            this.settings['buyers'].forEach(item => {
                const el = document.querySelector("#discount" + item.id);
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
        },
        discountTotal() {
            let total = this.receiptTotal() - (this.receiptTotal() * this.discount / 100);
            return total.toFixed(2)
        },
        buy(payment) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '-');
            let items = []
            this.receipt.forEach(element => {
                items.push(element.itemId)

                let item = this.settings['items'].find(i => i.id === element.itemId)
                item.count = item.count - 1
            });
            this.settings['receipts'].push(
                {
                    "id": this.settings['receipts'].length > 0 ? Math.max(...this.settings['receipts'].map(i => i.id)) + 1 : 1,
                    "shifId": this.shiftInfo.id,
                    "total": this.receiptTotal(),
                    "date": formattedDate,
                    "employee": this.shiftInfo.employee,
                    "items": items,
                    "buyerId": this.buyerId,
                    "discount": this.discount,
                    "toPaid": this.discountTotal(),
                    "payment": payment
                }
            )

            let shift = this.settings["shifts"].find(i => i.isOpen === true)
            shift.sales = shift.sales + 1
            shift.generalReceipt = shift.generalReceipt + Number(this.discountTotal())
            let buyer = this.settings["buyers"].find(i => i.id === this.buyerId)
            if (buyer) {
                buyer.buys = buyer.buys + 1
                buyer.totalAmount = buyer.totalAmount + Number(this.discountTotal())
            }
            this.change.input = 0
            this.receiptCancel()
        },
        generateBarcodeDiscount() {
            if (this.settings['buyers'].length > 9) {
                this.addBuyer.barcode = `46000000000${this.settings['buyers'].length}`
            } else {
                this.addBuyer.barcode = `460000000000${this.settings['buyers'].length}`
            }
        }
    },
    mounted() {
        this.$refs.scannerInput.focus()
        setInterval(() => {
            this.generateBarcodes();
        }, 100);
        setInterval(() => {
            if (this.page === 'searchAllItems') {
                this.focus('searchAllItems')
            }
        }, 100);
        // this.user = JSON.parse(sessionStorage.getItem("user")) || {};
        this.loadSettings();
    },
});