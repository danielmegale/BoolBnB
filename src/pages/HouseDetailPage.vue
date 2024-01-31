<script>
import axios from 'axios';

const messageEndpoint = 'http://127.0.0.1:8000/api/messages/';
const emtyForm = {
    name: "",
    email: "",
    message: "",
    house_id: ""
};
export default {
    data() {
        return {
            houseData: [],
            isLoading: false,
            form: emtyForm,
            errors: {},
            successMessage: null,
            inputName: "",
            inputSurname: "",
            ipAddress: null,
            currentIndex: 0,
            housePhotos: [],
        };
    },
    computed: {
        hasErrors() {
            //dato un oggetto dammi un array di chiavi, keys
            //se c'è una chiave restituisce true o false se non c'è.
            return Object.keys(this.errors).length;
        },
        showAlert() {
            // trasforma questa funzione in un booleano effettivo
            return Boolean(this.hasErrors || this.successMessage);
        },
        alertType() {
            //Ci sono errori? allora è danger altrimenti è success
            return this.hasErrors ? 'danger' : 'success';
        },
    },
    methods: {
        fetchIpAddress() {
            axios.get("https://api.ipify.org?format=json").then(res => {
                this.ipAddress = res.data.ip;
                const params = { ip_viewer: this.ipAddress, house_id: this.$route.params.id }
                axios.post("http://127.0.0.1:8000/api/houses/views", params).then()
            })
        },

        // FETCH HOUSE DATAS
        fetchData() {
            this.isLoading = true;
            const endpoint = 'http://127.0.0.1:8000/api/houses/';
            const houseId = this.$route.params.id;
            axios.get(endpoint + houseId).then((res) => {
                this.houseData.push(res.data);

                this.houseData.forEach(photos => {
                    this.housePhotos = photos.photos
                });

                console.log('photos', this.housePhotos)
                console.log('houseData', this.houseData)
            }).catch().then(() => { this.isLoading = false; });
        },
        mapTimeOut() {
            const timeOut = setTimeout(() => {
                this.fetchMap();
            }, 200);
        },

        // FETCH DATA AND CREATE MAP
        fetchMap() {
            let lat = this.houseData[0].address.latitude;
            let long = this.houseData[0].address.longitude;

            let center = [long, lat];

            const map = tt.map({
                key: 'soH7vSRFYTpCT37GOm8wEimPoDyc3GMe',
                container: "map",
                center: center,
                zoom: 15
            })
            map.on('load', () => {
                new tt.Marker().setLngLat(center).addTo(map)
            })
        },

        // SEND MESSAGES TO HOST

        sendForm() {
            this.errors = {};
            this.successMessage = null;
            this.form.house_id = this.$route.params.id;
            this.form.name = this.inputName + ' ' + this.inputSurname;
            axios.post(messageEndpoint, this.form)
                // Inviato il form lo svuoto riportandolo allo stato iniziale
                .then(res => {
                    this.form = emtyForm;
                    this.successMessage = 'Messaggio inviato'
                })
                .catch(err => {
                    if (err.response.status === 400) {
                        //prendo gli errori provenienti dal backend
                        const errors = err.response.data.errors
                        // preparo un oggetto da riempire
                        const errorMessages = {}

                        for (let field in errors) errorMessages[field] = errors[field][0];
                        this.errors = errorMessages;
                    } else {
                        console.error(err);
                        this.errors = { network: 'Si è verificato un errore' }
                    }

                })
                .then(() => { });
        },

        // CAROUSEL

        gotoNext() {

            if (this.currentIndex === this.housePhotos.length - 1) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
        },
        gotoPrev() {

            if (this.currentIndex === 0) {
                this.currentIndex = this.housePhotos.length - 1;
            } else {
                this.currentIndex--;
            }
        },
        gotoCurrentImg(targetIndex) {
            this.currentIndex = targetIndex;
        },
    },
    mounted() {
        this.fetchIpAddress()
        this.fetchData();
        this.mapTimeOut();

    }
};
</script>
<template>
    <section>
        <AppLoader v-if="isLoading" />
        <div v-else>
            <div class="house-detail container my-5" v-for="house in  houseData " :key="house.id">
                <h1 class="my-5 fw-bold">{{ house.type }} | {{ house.name }}</h1>
                <!-- CAROUSEL -->
                <div class="carousel">
                    <div id="prev" @click="gotoPrev()">
                        <i class="fa-solid fa-chevron-left"></i>
                    </div>
                    <div class="gallery" v-for='(image, index) in house.photos' v-show="currentIndex === index"
                        :key="house.id">

                        <img :src="image.img" class="img-fluid">
                        <div class="counter">
                            <span class="counter-text">{{ index + 1 }}/{{ housePhotos.length }}</span>
                        </div>
                    </div>
                    <div id="next" @click="gotoNext">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                </div>
                <!-- CONTENT -->
                <div class="row my-4">
                    <div class="col-xl-8 content-container pe-5">
                        <div>
                            <h5 class="fw-bold">{{ house.address.home_address }}</h5>
                        </div>
                        <div>
                            <span><strong>Stanze:</strong> {{ house.total_rooms }}</span> |
                            <span><strong>Letti:</strong> {{ house.total_beds }}</span> |
                            <span><strong>Bagni:</strong> {{ house.total_bath }}</span>
                        </div>
                        <div class="host-section">
                            <h6 class="py-4"><strong>Nome dell'host:</strong> {{ house.user.name }} {{ house.user.surname }}
                            </h6>
                        </div>
                        <div class="house-description">
                            <p>
                                {{ house.description }}
                            </p>
                        </div>
                        <div class="house-composition pb-5">
                            <h5 class="py-5">Composizione dell'alloggio</h5>
                            <div class="row">
                                <div class="col-12 wrapper-composition-cards ">
                                    <div class="card">
                                        <i class="fa-solid fa-house fa-xl my-3" style="color: #24bb83"></i>
                                        <div class="card-title">
                                            <p>
                                                <strong>Alloggio</strong>
                                            </p>
                                            <p class="text-center"><strong>{{ house.mq }} mq</strong></p>
                                        </div>
                                    </div>
                                    <div class="card ">
                                        <i class="fa-solid fa-bed fa-xl my-3" style="color: #24bb83"></i>
                                        <div class="card-title">
                                            <p>
                                                <strong>Camere da letto</strong>
                                            </p>
                                            <p class="text-center"><strong>{{ house.total_rooms }}</strong></p>
                                        </div>
                                    </div>
                                    <div class="card ">
                                        <i class="fa-solid fa-mattress-pillow fa-rotate-90 fa-xl my-3"
                                            style="color: #24bb83"></i>
                                        <div class="card-title">
                                            <p>
                                                <strong>Letti</strong>
                                            </p>
                                            <p class="text-center"><strong>{{ house.total_beds }}</strong></p>
                                        </div>
                                    </div>
                                    <div class="card ">
                                        <i class="fa-solid fa-toilet fa-xl my-3" style="color: #24bb83"></i>
                                        <div class="card-title">
                                            <p>
                                                <strong>Bagni</strong>
                                            </p>
                                            <p class="text-center"><strong>{{ house.total_bath }}</strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="house-services py-5">
                            <h5 class="pb-4">Servizi dell'alloggio</h5>
                            <div class="row">
                                <div class="col-12 wrapper-house-services-card">
                                    <div v-for="service in  house.services " class="card">
                                        <i :class="service.icon" class="fa-xl my-3" style="color: #24bb83"></i>
                                        <p>
                                            <strong>{{ service.name }}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4  form-reservation">
                        <div class="card">
                            <div class="card-title">
                                <div>
                                    <div class="price mb-3"><strong>{{ house.night_price }} €</strong>/notte</div>
                                    <h5 class="text-center my-3 fw-bolder">Invia un messaggio al host per maggiori
                                        informazioni</h5>

                                    <!-- ALET ERRORS -->
                                    <AppAlert :type="alertType" :isOpen="showAlert">
                                        <div v-if="successMessage" class="d-flex justify-content-center align-items-center">
                                            <i class="fa-solid fa-check fa-xl me-3" style="color: #24dd83;"></i>
                                            {{ successMessage }}
                                        </div>
                                        <div v-if="hasErrors">
                                            <ul class="errors-contant-form">
                                                <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
                                            </ul>
                                        </div>
                                    </AppAlert>

                                    <!-- FORM CONTACT HOST -->
                                    <form @submit.prevent="sendForm" novalidate
                                        class="d-flex flex-column align-items-center ">
                                        <div class="container mb-3">
                                            <div class="row">
                                                <div class="col-6">
                                                    <label for="name_reservation" class="form-label">Nome<span
                                                            class="text-danger">*</span></label>
                                                    <input v-model.trim="inputName" type="text" class="form-control"
                                                        id="name_reservation">
                                                </div>
                                                <div class="col-6">
                                                    <label for="surname_reservation" class="form-label">Cognome<span
                                                            class="text-danger">*</span></label>
                                                    <input v-model="inputSurname" type="text" class="form-control"
                                                        id="surname_reservation">
                                                </div>
                                            </div>
                                            <div class="row my-3">
                                                <div class="col-12">
                                                    <label for="email_reservation" class="form-label">Email<span
                                                            class="text-danger">*</span></label>
                                                    <input v-model.trim="form.email" type="email" class="form-control"
                                                        id="email_reservation">
                                                    <small>Inserisci la tua email, ti contatteremo a questo
                                                        indirizzo</small>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="mb-3">
                                                        <label for="detail_reservation" class="form-label">Messaggio<span
                                                                class="text-danger">*</span></label>
                                                        <textarea v-model.trim="form.message" class="form-control"
                                                            id="detail_reservation" rows="3"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-custom">Contatta</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <h4 class="fw-bold my-3">Dove ci troverai</h4>
                <div id="map">

                    <!-- MAPPA -->
                </div>
            </div>
            <div class="reservation" v-for=" house  in  houseData " :key="house.id">
                <div class="d-flex justify-content-between m-3">
                    <div class="price"><strong>{{ house.night_price }} €</strong>/notte</div>
                    <button class="btn btn-custom" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Contatta</button>
                </div>
            </div>



            <!-- OFFCANVAS -->
            <div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom"
                aria-labelledby="offcanvasBottomLabel">
                <div class="offcanvas-header">
                    <h5 class="text-center my-3 ">Invia un messaggio al host per maggiori informazioni</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body small">
                    <AppAlert :type="alertType" :isOpen="showAlert">
                        <div v-if="successMessage"> <i class="fa-solid fa-check fa-xl me-3" style="color: #24dd83;"></i> {{
                            successMessage }}</div>
                        <ul v-if="hasErrors">
                            <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
                        </ul>
                    </AppAlert>

                    <form @submit.prevent="sendForm" novalidate class="d-flex flex-column align-items-center ">
                        <div class="container mb-3">
                            <div class="row">
                                <div class="col-6">
                                    <label for="name_reservation" class="form-label">Nome<span
                                            class="text-danger">*</span></label>
                                    <input v-model.trim="inputName" type="text" class="form-control" id="name_reservation">
                                </div>
                                <div class="col-6">
                                    <label for="surname_reservation" class="form-label">Cognome<span
                                            class="text-danger">*</span></label>
                                    <input v-model="inputSurname" type="text" class="form-control" id="surname_reservation">
                                </div>
                            </div>
                            <div class="row my-3">
                                <div class="col-12">
                                    <label for="email_reservation" class="form-label">Email<span
                                            class="text-danger">*</span></label>
                                    <input v-model.trim="form.email" type="email" class="form-control"
                                        id="email_reservation">
                                    <small>Inserisci la tua email, ti contatteremo a questo
                                        indirizzo</small>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label for="detail_reservation" class="form-label">Messaggio<span
                                                class="text-danger">*</span></label>
                                        <textarea v-model.trim="form.message" class="form-control" id="detail_reservation"
                                            rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-custom">Contatta</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped>
.house-detail {
    img {
        border-radius: 10px;
    }
}

.house-composition {

    .card-title {
        margin-bottom: 0;
    }

}

.wrapper-composition-cards,
.wrapper-house-services-card {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}


.house-composition .card,
.house-services .card {
    width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px
}


.content-container {

    .house-description,
    .host-section,
    .house-services,
    .house-composition {
        border-bottom: 1px solid lightgray;
    }

    .host-section {
        border-top: 1px solid lightgray;
        margin-top: 30px;
    }

    .house-description {
        padding: 30px 0;
    }

}

.form-reservation {
    display: none;
    margin-top: 20px;

    .card {
        max-width: 450px;
        padding: 30px;
        box-shadow: 0px 0px 16px 0px #000;

        #detail_reservation {
            min-height: 200px;
        }

    }


    .btn-custom {
        padding: 10px 100px;
        font-size: 1.5rem;
    }
}

.price {
    font-size: 1.3rem;
}

.reservation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    height: 70px;
}

#map {
    height: 450px;
    width: 100%;
}

.offcanvas {
    height: 100%;
}

.errors-contant-form {

    list-style-type: none;

}


// CAROUSEL

.gallery img {
    height: 750px;
    width: 100%;
    object-fit: cover;
    border-radius: 10px;
}

.carousel {
    position: relative;

    #prev,
    #next {
        i {
            color: white;
            font-size: 3rem;
        }

        position: absolute;
        height: 100%;
        width: 120px;
        background-color: rgba(0, 0, 0, 0.349);
        visibility: hidden;
        font-size: 2rem;
        top: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }



    .counter {
        width: 100%;
        position: absolute;
        bottom: 20px;
        display: flex;
        justify-content: center;

        .counter-text {
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            background-color: rgba(0, 0, 0, 0.37);
        }
    }
}

#prev {
    left: 0px;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
}

#next {
    right: 0px;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
}

.carousel:hover #next,
.carousel:hover #prev {
    visibility: visible;
    animation: fadeIn 1s;
    opacity: 1;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
}
</style>