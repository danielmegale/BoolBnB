<script>
import axios from "axios";
import { store } from "../data/store";
import { router } from "../router/index";
import Searchbar from "../components/generals/ComponentSearchbar.vue";
import { resolveTransitionHooks } from "vue";
export default {
    name: "SearchPage",
    components: { Searchbar },
    watch: {
        $route(to, from) {
            // Gestisci qui i cambiamenti dell'URL

            if (to.fullPath !== from.fullPath) {
                this.getCardsFiltered();
            }
        },
    },
    data() {
        return {
            store,
            isLoading: false,
            noHouse: false,
            distance_default_meter: "20000",
            room_number: "0",
            beds_number: "0",
            distance_km: "20",
            serviceSelected: [],
            services: [],
            lat: "",
            long: "",
            address: "",
        };
    },
    methods: {
        isSponsored(house) {
            if (house.sponsors[house.sponsors.length - 1]) {
                const currentDate = new Date();
                const sponsorEndDate = new Date(
                    house.sponsors[house.sponsors.length - 1].pivot.sponsor_end
                );
                return sponsorEndDate > currentDate;
            }
        },
        reset() {
            this.distance_km = "20";
            this.room_number = "";
            this.beds_number = "";
            this.serviceSelected = [];
        },
        isSelect(id) {
            if (this.serviceSelected.includes(id)) {
                this.serviceSelected = this.serviceSelected.filter(function (item) {
                    return item != id;
                });
            } else this.serviceSelected.push(id);
            this.getCardsFiltered();
        },
        getCardsFiltered() {
            this.noHouse = false;
            this.isLoading = false;
            const endpoint = `http://127.0.0.1:8000/api/houses/search`;
            this.address = this.$route.query.address;
            this.lat = this.$route.query.lat;
            this.long = this.$route.query.long;

            // TRASFORMO IL INPUT DEL UTENTE DA KM IN METRI
            const distance_meters = parseFloat(this.distance_km) * 1000;

            axios
                .get(
                    endpoint +
                    `?lat=${this.lat}&long=${this.long}&distance=${distance_meters}&total_rooms=${this.room_number}&total_beds=${this.beds_number}&service=[${this.serviceSelected}]`
                )
                .then((res) => {
                    store.resultCards = [];
                    res.data.forEach((house) => {
                        if (this.isSponsored(house)) {
                            store.resultCards.push(house);
                        }
                    });
                    res.data.forEach((house) => {
                        if (!this.isSponsored(house)) {
                            store.resultCards.push(house);
                        }
                    });
                    if (!res.data.length) {
                        this.noHouse = true;
                    }
                    // store.resultCards = res.data;

                    console.log(store.resultCards);

                    this.fetchMapMultiMarker();

                    router.push({
                        name: "searchpage",
                        query: {
                            address: this.address,
                            lat: this.lat,
                            long: this.long,
                            distance: distance_meters,
                            total_rooms: this.room_number,
                            total_beds: this.beds_number,
                            service: this.serviceSelected.join(","),
                        },
                    });
                    this.isLoading = false;
                })
                .catch((err) => {
                    console.error(err);
                })
                .then(() => { });
        },

        //costruisco mappa da mostrare nella pagina della ricerca, contenente i marker degli appartamenti.
        fetchMapMultiMarker() {
            //inizializzo variabile per registrare i dati
            const houseDatas = [];

            //Prendere le coordinate e i dati desiderati in arrivo nella resultCards e costruire un oggetto con delle proprietà
            store.resultCards.forEach((house) => {
                const houseData = {
                    long: house.longitude,
                    lat: house.latitude,
                    name: house.name,
                    price: house.night_price,
                    id: house.id,
                };

                //uso metodo push per salvare i dati nel array
                houseDatas.push(houseData);
            });

            //uso le coordinate della ricerca per posizionare il centro della mappa
            const center = [this.long, this.lat];

            //costruisco al mappa
            const map = tt.map({
                key: "soH7vSRFYTpCT37GOm8wEimPoDyc3GMe",
                container: "map",
                center: center,
                zoom: 10,
            });

            //itero all'inerno dell'array di oggetti per posizionare i marker all'interno della mappa.
            houseDatas.forEach((data) => {
                //registro le coordinate del marker
                const marker = [data.long, data.lat];
                //genero il marker
                const newMarker = new tt.Marker().setLngLat(marker).addTo(map);

                const popup = new tt.Popup({ anchor: "top" }).setText(
                    data.price + " €" + " - " + data.name
                );
                newMarker.setPopup(popup).togglePopup();
            });
        },
    },
    created() {
        this.getCardsFiltered();
        axios.get(`http://127.0.0.1:8000/api/services`).then((res) => {
            this.services = res.data;
        });
    },
};
</script>
<template>
    <AppLoader v-if="isLoading" />
    <section v-else>
        <div class="container-sm container-xxl">
            <h1 class="my-5 text-center fw-bold">
                Cerca la tua destinazione, incomincia il tuo viaggio
            </h1>

            <!-- RESULT IN SEARCH PAGE -->

            <div class="wrapper-result">

                <!-- SEARCHBAR -->

                <div class="search-bar-mobile d-flex justify-content-center">
                    <Searchbar :address="address" />
                    <!-- BUTTON ACTIVATE OFFCANVAS -->
                    <button class="btn btn-light open-offcanvas" type="button" data-bs-toggle="offcanvas"
                        data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">
                        <i class="fa-solid fa-sliders"></i>
                    </button>
                </div>

                <div class="row mb-5">
                    <div class="col-12 filter">
                        <!--  FILTRI -->

                        <h4 class="fw-bold text-center my-5">Affina la tua ricerca</h4>
                        <form @submit.prevent="getCardsFiltered()">
                            <div class="row">
                                <div class="col-3">
                                    <div class="mb-3">
                                        <label for="room_number_id" class="form-label">Stanze:</label>
                                        <input v-model="room_number" type="number" class="form-control"
                                            id="room_number_id" />
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="mb-3">
                                        <label for="beds_number_id" class="form-label">Posti letto:</label>
                                        <input v-model="beds_number" type="number" class="form-control"
                                            id="beds_number_id" />
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="mb-3">
                                        <label for="distance_number_id" class="form-label">Distanza dal indirizzo
                                            ricercato</label>
                                        <input type="range" v-model="distance_km" class="form-range my-3" min="5" max="100"
                                            step="5" id="distance_number_id" />
                                        <span class="distance-field">{{ this.distance_km }} Km</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex mt-5">
                                <div class="row me-5">
                                    <div class="col">
                                        <h6>Servizi della stanza</h6>
                                        <div class="wrapper-checkbox">
                                            <div v-for="service in services" :key="service.id" class="form-check">
                                                <input @click="isSelect(service.id)" class="form-check-input mx-3"
                                                    type="checkbox" :id="'side-' + service.id" />
                                                <label class="form-check-label" :for="'side-' + service.id"><i
                                                        :class="service.icon"></i> {{ service.name }}
                                                </label>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-center mt-5 mb-3">
                                            <button @click="getCardsFiltered()" type="button" class="btn-custom">
                                                Invia
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="container-xxl">
            <h3 v-if="store.resultCards.length" class="my-5 text-center">
                Ecco cosa abbiamo trovato in {{ this.address }}
            </h3>
            <div class="row">
                <!-- RESULT SEARCHBAR -->
                <div class="col-12">
                    <div id="map"></div>
                </div>
                <div class="col-12 search-result" :class="{ 'justify-content-center': !store.resultCards.length }">
                    <div v-if="noHouse == true" class="d-flex flex-column align-items-center justify-content-center">
                        <i class="fa-solid fa-house-circle-xmark fa-shake fa-2xl mb-5" style="color: red"></i>
                        <h5 class="text-centern" :class="{ 'd-block': noHouse }">
                            Siamo spiacenti non abbiamo trovato quello che cercavi
                        </h5>
                    </div>
                    <HouseCard v-for="house in store.resultCards" :key="house.id" :house="house" />
                </div>
            </div>
        </div>


        <!-- OFFCANVAS -->

        <div class="offcanvas offcanvas-start" data-bs-backdrop="static" tabindex="-1" id="staticBackdrop"
            aria-labelledby="staticBackdropLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title mt-5" id="staticBackdropLabel">
                    Filtri
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <form>
                    <div class="row">
                        <div class="col-5">
                            <div class="mb-3">
                                <label for="room_number_id" class="form-label">Stanze:</label>
                                <input v-model="room_number" type="number" class="form-control" id="room_number_id" />
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="mb-3">
                                <label for="beds_number_id" class="form-label">Posti letto:</label>
                                <input v-model="beds_number" type="number" class="form-control" id="beds_number_id" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-7">
                            <div class="mb-3">
                                <label for="distance_number_id" class="form-label">Distanza dal indirizzo
                                    ricercato</label>
                                <input type="range" v-model="distance_km" class="form-range my-3" min="5" max="100" step="5"
                                    id="distance_number_id" />
                                <span class="distance-field">{{ this.distance_km }} Km</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <div class="row me-5">
                            <div class="col">
                                <h6>Servizi della stanza</h6>
                                <div class="form-check" v-for="service in services" :key="service.id">
                                    <input @click="isSelect(service.id)" class="form-check-input" type="checkbox"
                                        :id="service.id" />
                                    <label class="form-check-label" :for="service.id"><i :class="service.icon"></i> {{
                                        service.name }}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center my-5">
                            <button data-bs-dismiss="offcanvas" @click="getCardsFiltered()" type="button"
                                class="btn-custom">
                                Invia
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    </section>
</template>
<style lang="scss" scoped>
@use '../assets/scss/mediaquery' as *;
@use '../assets/scss/vars' as *;

.container-sm {
    .jumbo-search {
        height: 350px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
}

.wrapper-result {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.filter {
    display: none;
    // border: 1px solid $color-main;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0px 26px 30px -20px #25dd843f;


    .distance-field {
        margin: 20px 0;
        border: 1px solid lightgray;
        padding: 10px;
        border-radius: 10px;
    }

    .btn-custom {
        padding: 10px 30px;
        font-size: 1.2rem;
    }
}

.search-result {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.wrapper-checkbox {
    display: flex;
    flex-wrap: wrap;
}

#map {
    display: none;
    height: 100vh;
    width: 100%;
    position: sticky;
    top: 120px;
    margin-bottom: 50px;
    border-radius: 10px;
}
</style>
