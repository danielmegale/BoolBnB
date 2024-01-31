<script>

import axios from 'axios';
import ComponentSearchbar from '../components/generals/ComponentSearchbar.vue';
import { router } from '../router/index.js';
import { useRouter } from 'vue-router';
import { store } from '../data/store';
// import 'animate.css';
const endpoint = 'http://127.0.0.1:8000/api/houses/';
export default {
    components: { ComponentSearchbar },
    name: 'HomePage',
    data() {
        return {
            store,
            evidenceHouses: [],
            allHouses: [],
            isLoading: false,
            counter: 9,
            searchResults: [],
            showGoUp: false,
            noMore: false,

            popularCityes: [
                {
                    name: 'Roma',
                    img: '../public/img/roma.jpg'
                },
                {
                    name: 'Milano',
                    img: '../public/img/milano.jpg'
                },
                {
                    name: 'Venezia',
                    img: '../public/img/venezia.webp'
                },
                {
                    name: 'Firenze',
                    img: '../public/img/firenze.jpg'
                },
                {
                    name: 'Napoli',
                    img: '../public/img/napoli.png'
                },
                {
                    name: 'Torino',
                    img: '../public/img/torino.jpg'
                }
            ]
        }
    },
    computed: {
        moreHouses() {
            if (this.allHouses.length > this.counter) {
                this.noMore = true;
            }
            return this.moreHouses;
        },
        visibleHouses() {
            return this.allHouses.slice(0, this.counter);
        }
    },
    methods: {
        fetchEvidenceHouses() {
            this.isLoading = true;
            axios.get(endpoint).then(res => {
                this.evidenceHouses = res.data.houses.data;

                this.allHouses = res.data.all_houses;
            }).catch(err => {
                console.log(err);
            }).then(() => { this.isLoading = false })
        },

        // MOST POPULAR

        fetchpPopular(index) {
            const tomtomApiKey = "key=soH7vSRFYTpCT37GOm8wEimPoDyc3GMe";
            const searchCity = this.popularCityes[index].name


            this.searchResults = [];
            axios
                .get(
                    `https://api.tomtom.com/search/2/search/${searchCity}.json?limit=5&countrySet=IT&extendedPostalCodesFor=Addr&view=Unified&${tomtomApiKey}`
                )
                .then((res) => {
                    if (this.searchResults.length) this.searchResults = [];
                    const results = res.data.results;


                    results.forEach((result) => {
                        this.searchResults.push(result);
                    });


                    this.getCoordinates();
                })
                .catch()
                .then();
        },
        getCoordinates() {

            const searchCity = this.searchResults[0].address.freeformAddress;
            this.lat = this.searchResults[0].position.lat;
            this.long = this.searchResults[0].position.lon;
            store.showCards = true;

            router.push({ name: 'searchpage' });
            this.isLoading = false;
            router.push({
                name: 'searchpage',
                query: {
                    address: searchCity,
                    lat: this.lat,
                    long: this.long,
                }
            });
        },
        showMoreHouses() {
            this.counter += 9;
        },
        scrollDetect() {
            if (window.screenY === 0) {
                this.showGoUp = false;
            }
            if (window.scrollY >= 1000) {
                this.showGoUp = true;
            }
        }
    },
    mounted() {
        this.fetchEvidenceHouses();
        window.addEventListener('scroll', this.scrollDetect);
    }
}
</script>
<template>
    <!-- <AppNotFound /> -->
    <AppLoader v-if="isLoading" />
    <div v-else>
        <!-- JUMBOTRON -->
        <section>
            <div class="container-flui jumbotron">
                <hgroup class="home-title">
                    <h3>Esplora, riposa, divertiti</h3>
                    <h1><strong>La tua casa lontano da casa</strong></h1>
                </hgroup>
                <ComponentSearchbar />
            </div>
        </section>
        <!-- SPOSORS SECTION -->
        <section class="featured container-xxl py-5">
            <h2 class="my-5 fw-bold"><strong>Trova l'ispirazione per i tuoi viaggi</strong></h2>
            <h5 class="text-center fw-bolder">Con i nostri alloggi in evidenza</h5>

            <div class="row">
                <div v-if="evidenceHouses.length" class="col wrapper-featured-cards">
                    <HouseCard v-for="house in evidenceHouses" :key="house.id" class="my-3" :house="house" />
                </div>
                <h4 v-else class="text-center">Attualmente non ci sono appartamenti in evidenza</h4>
            </div>

        </section>
        <!-- TRAVEL IMG -->
        <section class="travel-jumbo">
            <img src="../../public/img/travel.png" alt="_travel" class="img-fluid img-travel-banner">
        </section>
        <section class="container-xxl popular-city container-fluid my-5 pt-3">
            <h2 class="text-center my-5"><strong>Le mete Italiane più famose</strong></h2>
            <div class="row">
                <div class="col wrapper-city">
                    <div @click="fetchpPopular(index)" v-for="(city, index) in popularCityes" class="city card">
                        <img :src="city.img" :alt="city.name" class="img-fluid">
                        <span class="city-name">{{ city.name }}</span>
                    </div>
                </div>
            </div>
        </section>
        <!-- ALL HOUSE SECTION -->
        <section class="all-houses container-xxl mt-5">
            <h2 class="text-center my-5 pt-5"><strong>Tutte le nostra case</strong></h2>
            <div class="row">
                <div class="col">
                    <HouseCard v-for="(house, index) in visibleHouses" :key="house.id" class="my-3" :house="house" />
                </div>
                <div class="d-flex justify-content-center my-5">
                    <button @click="showMoreHouses" class="btn-custom">Mostra altro</button>
                </div>
            </div>
        </section>
        <!-- TRAVEL CONTENT TOP FOOTER -->
        <section class="travel py-5">
            <div class="container">
                <div class="row">
                    <div class="col-8">
                        <h4 class="my-5">Scegli una meta, inizia la tua esperienza</h4>
                        <p>Incomincia il tuo viaggio ora, contatta l'host del appartamento scelto al resto penseremo
                            noi.
                            Tu dovrai solo preoccuparti di divertirti e goderti il viaggio.
                        </p>
                    </div>
                    <div class="col-4">
                        <img src="../img/travel.jpg" alt="" class="img-fluid">
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- GO TO UP -->
    <a href="#app" id="go-up" v-if="showGoUp">
        <i class="fa-solid fa-angles-up"></i>
    </a>
</template>

<style lang="scss">
@use '../assets/scss/mediaquery' as *;
@use '../assets/scss/vars' as *;

h2 {
    font-size: 2.5rem;
}

// JUMBOTRON 
.jumbotron {
    // position: relative;
    height: 450px;
    background-image: url(../../public/img/jumbo_5.jpg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: center;

    .home-title {
        margin: 100px 0;
    }

    figure {
        height: 100%;
    }

    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        // filter: blur(2px);
    }
}

.home-title {
    text-align: center;
    font-size: 5rem;
    text-shadow: 1px 1px 2px black;
    color: white;

    h1 {
        font-size: 2rem;
    }
}

// SECTION FEATURED

.featured {
    border-radius: 10px;
    // background-color: #25dd8417;
}

.featured,
.wrapper-featured-cards {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.wrapper-featured-cards {
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
}

//jumbo travel

.travel-jumbo {
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
    max-height: 900px;

    img {
        max-height: 100%;
        object-fit: contain;
    }
}


.travel {
    background-color: #F7F7F7;

    .row {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
    }
}

.wrapper-city {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
}

.city {
    cursor: pointer;
    min-width: calc(100% / 3 - 40px);
    height: 500px;

    &:hover {

        animation: zoom-in-zoom-out 0.5s forwards;

        @keyframes zoom-in-zoom-out {
            0% {
                transform: scale(1, 1);
            }

            100% {
                transform: scale(1.02, 1.05);
            }
        }
    }

    img {
        height: 100%;
        object-fit: cover;
    }

    .city-name {
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: 2rem;
        font-weight: 600;
        color: white;
        text-shadow: 3px 2px 2px #000000;
    }
}

.all-houses {

    .col {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .btn-custom {
        padding: 20px 60px;
        color: black;
        font-weight: 600;
        font-size: 1.2rem;

        &:hover {
            color: white;
        }
    }
}

#go-up {
    position: fixed;
    bottom: 100px;
    right: 100px;
    padding: 15px 20px;
    border-radius: 50%;
    background-color: $color-main;

    .fa-angles-up {
        font-size: 1.5rem;
        color: $custom-black;
    }

    &:hover {
        background-color: $custom-black;

        .fa-angles-up {
            color: white;
        }

    }

}
</style>