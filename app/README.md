# Innterior Mobile

Expo and React Native storefront for the Innterior furniture marketplace. It uses the same Express API as `client/` and keeps the shopping bag on-device.

## Start

```powershell
npm install
npm run start
```

Run `npm run android` or `npm run ios` to open on a simulator. For the web preview, run `npm run web`.

## API address

The default API is `http://10.0.2.2:8000/api` on Android emulators and `http://localhost:8000/api` on iOS simulators. For a physical phone, set `EXPO_PUBLIC_API_BASE` to the development machine's LAN address, for example `http://192.168.1.20:8000/api`. See `.env.example`.

The app uses the existing product catalog/search/detail, public marketplace maker, Firebase user, and room-design endpoints. The checkout captures delivery and order-review details; as in the prototype, payment and delivery are confirmed by the Innterior team rather than charged in-app.