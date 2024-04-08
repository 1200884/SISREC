// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
//LOGISTICS_URL: 'http://vsgate-s1.dei.isep.ipp.pt:10136/api',
  LOGISTICS_URL_LOCAL: 'http://localhost:2223/api',
  //WAREHOUSE_URL: 'http://vsgate-s1.dei.isep.ipp.pt:10414/api',
  //WAREHOUSE_URL_LOCAL: "https://localhost:5001/api",

  APPOINTMENTS_URL: "/appointment",
  AUTH_URL: "/auth",
  PLACES_URL: "/place",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
