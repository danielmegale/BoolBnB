<script>
export default {
    props: {
        house: Object,
    },
    computed: {
        isSponsored() {
            if (this.house.sponsors) {
                if (this.house.sponsors[this.house.sponsors.length - 1]) {
                    const currentDate = new Date();
                    const sponsorEndDate = new Date(this.house.sponsors[this.house.sponsors.length - 1].pivot.sponsor_end);
                    return sponsorEndDate > currentDate;
                }
            }
        }
    }
}
</script>

<template>
    <div>
        <RouterLink :to="{ name: 'house-detail', params: { id: house.id } }" class="card">


            <div v-for="(photo, index) in  house.photos ">
                <div v-if="index === 0">
                    <img :src="photo.img" class="card-img-top" alt="jumbo">
                </div>
            </div>
            <div class="card-body d-flex flex-column justify-content-between">
                <div class="card-content">
                    <h6>{{ house.name }}</h6>
                    <div class="evidence-services m-0 mb-3">
                        <span>stanze {{ house.total_rooms }}</span> |
                        <span>letti {{ house.total_beds }}</span> |
                        <span>bagni {{ house.total_bath }}</span> |
                        <span>mq {{ house.mq }}</span>
                    </div>
                    <div v-if="house.home_address">{{ house.home_address }}</div>
                    <div v-else class="address m-0">{{ house.address.home_address }}</div>
                    <div class="my-3">
                        <span v-for=" service  in  house.services " :key="service.id" class="my-5">
                            <i :class="service.icon"></i>&nbsp;
                        </span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="d-flex justify-content-between"><strong>{{ house.night_price }} /Notte</strong>
                        <span v-if="isSponsored">
                            <i class="fa-solid fa-star fa-flip" style="color: #22dd85;"></i>
                        </span>
                    </div>
                </div>
            </div>
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
.card {
    width: 23rem;

    .card-img-top {
        height: 350px;
        object-fit: cover;
    }

    .evidence-services {
        font-size: 0.6rem;
        font-weight: 600;
    }

}

a {
    text-decoration: none;
}

@media screen and (min-width: 996px) {
    .card {
        width: 25rem;
    }
}
</style>
