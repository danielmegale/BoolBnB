<script>
import axios from 'axios';
import { store } from "../../data/store";
import { router } from '../../router/index.js';
import { useRouter } from 'vue-router';
const endpoint = `http://127.0.0.1:8000/api/houses/search`;
const tomtomApiKey = "key=Y9WgIJTG4Dl6xJPPjlGdCUdsZrhG2Fml";

export default {
    name: "ComponentSearchbar",
    props: { address: String },
    data() {
        return {
            isWrong: false,
            houseFiltered: [],
            store,
            searchCity: this.address,
            searchResults: [],
            currentIndex: "",
            isSelected: false,
            isLoading: false,
            debouncedFetchAddress: null,
            lat: "",
            long: "",
            showSelectionMessage: false,
        }
    },
    computed: {
        disableSelect() {
            const dom = document.getElementById('app');

            dom.addEventListener('click', function (event) {
                if (event.target === dom) {
                    console.log('clicca')
                    this.isSelected = false
                }
            })

            return this.disableSelect;
        }
    },
    methods: {
        handleSearchCityInput() {

            if (!this.isSelected) {
                this.showSelectionMessage = true;
            };
            // Clear Timeout (if exist) to avoid multiple call
            clearTimeout(this.debouncedFetchAddress);

            // Set a new timeout of 1000 milliseconds (1 second)
            this.debouncedFetchAddress = setTimeout(() => {
                if (this.searchCity.length) {
                    this.fetchAddress();
                }
            }, 500);
        },
        fetchAddress() {
            this.searchResults = [];
            axios
                .get(
                    `https://api.tomtom.com/search/2/search/${this.searchCity}.json?limit=5&countrySet=IT&extendedPostalCodesFor=Addr&view=Unified&${tomtomApiKey}`
                )
                .then((res) => {
                    this.isSelected = false;
                    if (this.searchResults.length) this.searchResults = [];
                    const results = res.data.results;

                    results.forEach((result) => {
                        this.searchResults.push(result);
                    });
                })
                .catch()
                .then();
        },
        getCoordinates(targetIndex) {

            this.searchCity = this.searchResults[targetIndex].address.freeformAddress;
            this.lat = this.searchResults[targetIndex].position.lat;
            this.long = this.searchResults[targetIndex].position.lon;
            this.isSelected = true;
            store.showCards = true;

            this.isLoading = true;

            router.push({ name: 'searchpage' });
            this.isLoading = false;
            router.push({
                name: 'searchpage',
                query: {
                    address: this.searchCity,
                    lat: this.lat,
                    long: this.long,
                }
            });
        },
        getWrongAddress() {
            this.isWrong = true
        }

    },
};
</script>

<template>
    <AppLoader v-if="isLoading" />
    <div class="wrapper-search d-flex flex-column ">
        <div v-if="isWrong && !isSelected" class="alert alert-info  mb-5">
            <i class="fa-solid fa-house-circle-exclamation fa-bounce fa-xl me-3" style="color: #25dd85;"></i>
            <strong>Seleziona uno dei suggerimenti</strong>
        </div>
        <div class="search-bar me-3">
            <form @keyup.prevent="handleSearchCityInput" @submit.prevent="getWrongAddress()">
                <input v-model.trim="searchCity" type="text" class="form-control" placeholder="Cerca la tua destinazione" />
                <button class="btn btn-search bg-white" type="submit">
                    <i class="fa-solid fa-magnifying-glass-location"></i>
                </button>
            </form>
            <ul class="list-group list-group-flush" v-if="!isSelected">
                <li v-for="( result, index ) in  searchResults " :key="result.address.country" class="list-group-item"
                    @click="getCoordinates(index)">
                    {{ result.address.freeformAddress }}
                </li>
            </ul>
        </div>
    </div>

    <!-- OFFCANVAS -->
</template>

<style lang="scss">
.search-bar,
.form-control,
.btn-search {
    border-radius: 20px;

}

.search-bar {
    width: 300px;
    box-shadow: 0px 26px 30px -20px #25dd843f;
    position: relative;
    border: 3px solid #25dd85;
    border-radius: 25px;

    .form-control {
        height: 40px;
        border: 0;
        font-size: 1rem;
        transition: none;
    }

    .btn-search {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        .fa-magnifying-glass-location {
            color: #25dd85;
        }
    }

    .form-control:focus {
        box-shadow: none;
        border-color: white;
    }


    .btn-search:active {
        border-color: white;
    }

    .list-group {
        border-radius: 5px;
        position: absolute;
        bottom: -10;
        left: 0;
        right: 0;

        .list-group-item {
            cursor: pointer;

            &:hover {
                background-color: #2cdd82;
                color: white;
            }
        }
    }
}

.open-offcanvas {
    height: 40px;
}

.offcanvas.offcanvas-start {
    width: 100%;
}

.btn-custom {
    padding: 4px 15px;
    border-radius: 30px;
    color: #ffffff;
    border: 0;
    background-image: linear-gradient(to right, #97e15f, #22dd85);
    text-decoration: none;

    &:hover {
        background-image: linear-gradient(to right, #4c4c4c, #191919);
    }
}

ul {
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.2);
}
</style>
