document.addEventListener('alpine:init', () => {
    Alpine.data('misstee', () => ({
        garments: [],
        genderFilter: '',
        seasonFilter: '',
        description: '',
        img: '',
        season: '',
        gender: '',
        price: '',
        newPrice: '',
        maxPrice: 0,
        addBtn: false,
        error: false,
        info_message: '',
        loadData() {

            fetch('/api/garments')
                .then(r => r.json())
                .then(userData => this.garments = userData.data)
        },

        Filter() {
            console.log(this.season);

            fetch('/api/garments')
                .then(r => r.json())
                .then(userData => {

                    const filteredGarments = userData.data.filter(garment => {
                        if (this.gender != 'All' && this.season != 'All') {
                            return garment.gender === this.gender
                                && garment.season === this.season;
                        } else if (this.gender != 'All') { // if gender was supplied
                            return garment.gender === this.gender
                        } else if (this.season != 'All') { // if season was supplied
                            return garment.season === this.season
                        }
                        return true;
                    })

                    this.garments = filteredGarments;


                })
        },

        priceFilter() {
            console.log(this.maxPrice)
            let maxPrice = Number(this.price)
            fetch('/api/garments')
                .then(r => r.json())
                .then(userData => {
                    const filteredGarments = userData.data.filter(garment => {
                        // filter only if the maxPrice is bigger than maxPrice
                        if (maxPrice > 0) {
                            return garment.price <= maxPrice;
                        }
                        return true;
                    });
                    this.garments = filteredGarments;
                })
        },

        addMessages() {

            const entrys = {
                description: this.description, img: this.img, newPrice: this.newPrice, gender: this.gender, season: this.season,
            }
            if (this.description && this.img && this.newPrice && this.gender && this.season != '') {
                axios
                    .post('/api/garment', entrys)
                    .then(r => this.loadData())
                    .then(() => {
                        this.info_message = 'New garment has been added!'
                        this.error = false
                    })
            }


             else if (!this.description || !this.img || !this.newPrice) {
                this.info_message = 'Please fill all the empty fields'
                this.error = true;
            }
            // else if (this.garments.find(garment =>{return garment.description === this.description} )){

            //     this.info_message = 'data already exists'
            //     this.error = true;
            // }
            setTimeout(() => {
                this.info_message = '';
                this.error = false;
            }, 3000);
        }


    }))
})

