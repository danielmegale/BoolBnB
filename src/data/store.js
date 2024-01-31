import { reactive } from "vue";

export const store = reactive({
  jumboCarousel: [
    "../../public/img/jumbo_1.jpeg",
    "../../public/img/jumbo_2.jpeg",
    "../../public/img/jumbo_3.jpg",
    "../../public/img/jumbo_4.jpg",
  ],
  isLoading: false,
  resultCards: [],
  showCards: false,
  lat: "",
  long: "",
  room_number: "",
  beds_number: "",
  distance_number: "20000",
});
