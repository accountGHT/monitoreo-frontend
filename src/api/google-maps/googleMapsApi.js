import { Loader } from "@googlemaps/js-api-loader";

const googleMapsApiKey = 'AIzaSyBYje8EnD-SsvR-MMMb2sO_PCR6TwBIP7s';

const loader = new Loader({
    apiKey: googleMapsApiKey,
    version: "weekly",
    libraries: ["places"]
});

export const searchPlaces = async (searchText) => {
    try {
        await loader.load();
        const autocompleteService = new google.maps.places.AutocompleteService();
        const request = {
            input: searchText,
            componentRestrictions: { country: 'PE' },
        };

        return new Promise((resolve, reject) => {
            autocompleteService.getPlacePredictions(request, (predictions, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(predictions);
                } else {
                    reject(`searchPlaces: EXCEPTION: ${status}`);
                }
            });
        });
    } catch (error) {
        console.error(`searchPlaces: EXCEPTION: ${error.message}`, error);
        return { error: 'Unknown' };
    }
};

export const getPlaceInfo = async (placeId) => {
    try {
        await loader.load();
        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        const request = {
            placeId: placeId,
            fields: ['name', 'formatted_address', 'geometry', 'rating', 'opening_hours', 'photos']
        };

        return new Promise((resolve, reject) => {
            placesService.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log('Place Details:', place); // Añadir este log
                    if (place.geometry && place.geometry.location) {
                        console.log('Latitude:', place.geometry.location.lat());
                        console.log('Longitude:', place.geometry.location.lng());
                    } else {
                        console.log('Geometry or location is undefined');
                    }
                    resolve(place);
                } else {
                    reject(`getPlaceInfo: EXCEPTION: ${status}`);
                }
            });
        });
    } catch (error) {
        console.error(`getPlaceInfo: EXCEPTION: ${error.message}`, error);
        return { error: 'Unknown' };
    }
};

